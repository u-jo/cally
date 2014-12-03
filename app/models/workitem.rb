class Workitem < ActiveRecord::Base
  belongs_to :user
  has_many :work_logs
  validates :user_id, presence: true
  validates :content, presence: true, length: { maximum: 140 }


end
