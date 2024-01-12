"""empty message

Revision ID: 48a53355fabc
Revises: 67e4c766efa9
Create Date: 2024-01-09 21:53:17.079538

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '48a53355fabc'
down_revision = '67e4c766efa9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('persona', schema=None) as batch_op:
        batch_op.add_column(sa.Column('dv', sa.String(length=1), nullable=False))
        batch_op.create_unique_constraint(None, ['dv'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('persona', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_column('dv')

    # ### end Alembic commands ###
