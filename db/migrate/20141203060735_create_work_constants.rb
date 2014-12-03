class CreateWorkConstants < ActiveRecord::Migration
  def change
    create_table :work_constants do |t|
      t.integer :work_time
      t.references :user, index: true
      t.timestamps
    end
  end
end
