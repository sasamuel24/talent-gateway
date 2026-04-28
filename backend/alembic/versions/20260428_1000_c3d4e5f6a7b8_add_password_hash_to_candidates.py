"""add password_hash to candidates for candidate portal auth

Revision ID: c3d4e5f6a7b8
Revises: b2c3d4e5f6a7
Create Date: 2026-04-28 10:00:00
"""
from alembic import op
import sqlalchemy as sa

revision = 'c3d4e5f6a7b8'
down_revision = 'b2c3d4e5f6a7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'candidates',
        sa.Column('password_hash', sa.String(255), nullable=True),
    )


def downgrade() -> None:
    op.drop_column('candidates', 'password_hash')
