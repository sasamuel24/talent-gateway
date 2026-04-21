"""
Script de limpieza — elimina candidatos sin ninguna aplicación (huérfanos).

Uso:
    py clean_orphan_candidates.py          # muestra huérfanos y pide confirmación
    py clean_orphan_candidates.py --dry-run  # solo muestra, no borra
"""
import argparse
import os
import sys

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("[ERROR] Variable de entorno DATABASE_URL no definida.")
    sys.exit(1)

engine = create_engine(DATABASE_URL)

FIND_ORPHANS_SQL = """
SELECT c.id, c.name, c.email, c.created_at
FROM candidates c
LEFT JOIN applications a ON a.candidate_id = c.id
WHERE a.id IS NULL
ORDER BY c.created_at DESC;
"""

DELETE_ORPHANS_SQL = """
DELETE FROM candidates
WHERE id IN (
    SELECT c.id
    FROM candidates c
    LEFT JOIN applications a ON a.candidate_id = c.id
    WHERE a.id IS NULL
);
"""


def main():
    parser = argparse.ArgumentParser(description="Limpia candidatos sin aplicaciones.")
    parser.add_argument("--dry-run", action="store_true", help="Solo muestra los registros, no borra.")
    args = parser.parse_args()

    with engine.connect() as conn:
        orphans = conn.execute(text(FIND_ORPHANS_SQL)).fetchall()

        if not orphans:
            print("[OK] No hay candidatos huérfanos.")
            return

        print(f"\nCandidatos sin aplicaciones ({len(orphans)}):")
        print("-" * 70)
        for row in orphans:
            print(f"  ID: {row.id}  |  {row.name}  |  {row.email}  |  {row.created_at}")
        print("-" * 70)

        if args.dry_run:
            print("[DRY-RUN] No se realizó ningún cambio.")
            return

        confirm = input(f"\n¿Eliminar {len(orphans)} candidato(s) huérfano(s)? [s/N]: ").strip().lower()
        if confirm != "s":
            print("[CANCELADO] No se realizó ningún cambio.")
            return

        result = conn.execute(text(DELETE_ORPHANS_SQL))
        conn.commit()
        print(f"[OK] {result.rowcount} candidato(s) eliminado(s).")


if __name__ == "__main__":
    main()
