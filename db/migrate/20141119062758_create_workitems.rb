class CreateWorkitems < ActiveRecord::Migration
  def change
    create_table :workitems do |t|
      t.text :content
      t.references :user, index: true
      t.date :due_date
      t.boolean :active
      t.integer :minutes_needed
      t.integer :minutes_completed

      t.timestamps
    end
    add_index :workitems, :user_id, :created_at

  end
end
