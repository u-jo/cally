class Workitem < ActiveRecord::Base
  belongs_to :user
  attr_accessible :content, :active, :due_date, :minutes_needed, :minutes_completed
  validates :email, presence: true
  validates :content, presence: true, length: { maximum: 140 }

  default_scope -> { order('created_at') }

end
