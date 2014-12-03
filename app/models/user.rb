class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  has_many :workitems, dependent: :destroy
  has_many :events, dependent: :destroy
  has_many :work_logs, through: :workitems
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

end
