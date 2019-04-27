"""empty message

Revision ID: 4e1b00e42c43
Revises: 
Create Date: 2019-04-27 03:44:46.894346

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4e1b00e42c43'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('follows', sa.Column('follower_id', sa.Integer(), nullable=True))
    op.drop_column('follows', 'follow_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('follows', sa.Column('follow_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_column('follows', 'follower_id')
    # ### end Alembic commands ###