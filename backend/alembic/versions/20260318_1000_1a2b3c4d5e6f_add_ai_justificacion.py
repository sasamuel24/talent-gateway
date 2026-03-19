"""add ai_justificacion to applications

Revision ID: 1a2b3c4d5e6f
Revises: 029257cbc9c4
Create Date: 2026-03-18 10:00:00
"""
from alembic import op
import sqlalchemy as sa

revision = '1a2b3c4d5e6f'
down_revision = '029257cbc9c4'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('applications', sa.Column('ai_justificacion', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('applications', 'ai_justificacion')
