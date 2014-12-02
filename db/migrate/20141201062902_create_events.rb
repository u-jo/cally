class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :name
      t.date :date
      t.integer :start_time
      t.integer :end_time
      t.references :user, index: true
      t.timestamps
    end
  end
  
end