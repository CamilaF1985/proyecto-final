"""empty message

Revision ID: 17fa1340ddcc
Revises: 48a53355fabc
Create Date: 2024-01-10 20:37:57.598703

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '17fa1340ddcc'
down_revision = '48a53355fabc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('persona', schema=None) as batch_op:
        batch_op.alter_column('contrasena',
               existing_type=sa.VARCHAR(length=100),
               type_=sa.String(length=250),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('persona', schema=None) as batch_op:
        batch_op.alter_column('contrasena',
               existing_type=sa.String(length=250),
               type_=sa.VARCHAR(length=100),
               existing_nullable=False)

    # ### end Alembic commands ###
