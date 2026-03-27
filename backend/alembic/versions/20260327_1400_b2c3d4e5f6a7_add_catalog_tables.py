"""add catalog tables for cities, job types, areas, contract types

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-03-27 14:00:00
"""
from alembic import op
import sqlalchemy as sa

revision = 'b2c3d4e5f6a7'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Crear tablas de catálogo
    op.create_table(
        'catalog_cities',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
    )
    op.create_index('ix_catalog_cities_name', 'catalog_cities', ['name'])

    op.create_table(
        'catalog_job_types',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
    )
    op.create_index('ix_catalog_job_types_name', 'catalog_job_types', ['name'])

    op.create_table(
        'catalog_areas',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
    )
    op.create_index('ix_catalog_areas_name', 'catalog_areas', ['name'])

    op.create_table(
        'catalog_contract_types',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
    )
    op.create_index('ix_catalog_contract_types_name', 'catalog_contract_types', ['name'])

    # Sembrar datos iniciales
    op.execute(
        "INSERT INTO catalog_areas (name, is_active) "
        "SELECT DISTINCT area, true FROM jobs WHERE area IS NOT NULL AND area != '' "
        "ON CONFLICT (name) DO NOTHING"
    )
    op.execute(
        "INSERT INTO catalog_contract_types (name, is_active) VALUES "
        "('Contrato laboral', true), ('Contrato de aprendizaje', true) "
        "ON CONFLICT (name) DO NOTHING"
    )

    # Agregar columnas FK a jobs (nullable para compatibilidad)
    op.add_column('jobs', sa.Column('city_id', sa.Integer(), nullable=True))
    op.add_column('jobs', sa.Column('job_type_id', sa.Integer(), nullable=True))
    op.add_column('jobs', sa.Column('area_id', sa.Integer(), nullable=True))
    op.add_column('jobs', sa.Column('contract_type_id', sa.Integer(), nullable=True))

    op.create_foreign_key('fk_jobs_city_id', 'jobs', 'catalog_cities', ['city_id'], ['id'], ondelete='SET NULL')
    op.create_foreign_key('fk_jobs_job_type_id', 'jobs', 'catalog_job_types', ['job_type_id'], ['id'], ondelete='SET NULL')
    op.create_foreign_key('fk_jobs_area_id', 'jobs', 'catalog_areas', ['area_id'], ['id'], ondelete='SET NULL')
    op.create_foreign_key('fk_jobs_contract_type_id', 'jobs', 'catalog_contract_types', ['contract_type_id'], ['id'], ondelete='SET NULL')

    # Migrar area existente → area_id
    op.execute("UPDATE jobs SET area_id = ca.id FROM catalog_areas ca WHERE jobs.area = ca.name")


def downgrade() -> None:
    op.drop_constraint('fk_jobs_contract_type_id', 'jobs', type_='foreignkey')
    op.drop_constraint('fk_jobs_area_id', 'jobs', type_='foreignkey')
    op.drop_constraint('fk_jobs_job_type_id', 'jobs', type_='foreignkey')
    op.drop_constraint('fk_jobs_city_id', 'jobs', type_='foreignkey')
    op.drop_column('jobs', 'contract_type_id')
    op.drop_column('jobs', 'area_id')
    op.drop_column('jobs', 'job_type_id')
    op.drop_column('jobs', 'city_id')
    op.drop_index('ix_catalog_contract_types_name', 'catalog_contract_types')
    op.drop_table('catalog_contract_types')
    op.drop_index('ix_catalog_areas_name', 'catalog_areas')
    op.drop_table('catalog_areas')
    op.drop_index('ix_catalog_job_types_name', 'catalog_job_types')
    op.drop_table('catalog_job_types')
    op.drop_index('ix_catalog_cities_name', 'catalog_cities')
    op.drop_table('catalog_cities')
