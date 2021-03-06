# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141203060735) do

  create_table "events", force: true do |t|
    t.string   "name"
    t.date     "date"
    t.integer  "start_time"
    t.integer  "end_time"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "events", ["user_id"], name: "index_events_on_user_id"

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "name"
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

  create_table "work_constants", force: true do |t|
    t.integer  "work_time"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "work_constants", ["user_id"], name: "index_work_constants_on_user_id"

  create_table "work_logs", force: true do |t|
    t.integer  "change_in_time"
    t.integer  "workitem_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "work_logs", ["workitem_id"], name: "index_work_logs_on_workitem_id"

  create_table "workitems", force: true do |t|
    t.text     "content"
    t.integer  "user_id"
    t.datetime "due_date"
    t.boolean  "active"
    t.integer  "minutes_needed"
    t.integer  "minutes_completed"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "workitems", ["user_id", "created_at"], name: "index_workitems_on_user_id_and_created_at"
  add_index "workitems", ["user_id"], name: "index_workitems_on_user_id"

end
