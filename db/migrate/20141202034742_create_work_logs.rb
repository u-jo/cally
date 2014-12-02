class CreateWorkLogs < ActiveRecord::Migration
  def change
    create_table :work_logs do |t|
      t.integer :change_in_time
      t.references :workitem, index: true
      t.timestamps
    end
  end
end
