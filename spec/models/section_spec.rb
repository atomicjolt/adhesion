require 'vcr'
require 'rails_helper'

LMS_COURSE_ID      = 263
LMS_SECTION_ID     = 260
BOB3_LMS_USER_ID   = 342

RSpec.describe Section, type: :model do
  before do
    @course = FactoryGirl.create(:course, lms_course_id: LMS_COURSE_ID)
    bob = FactoryGirl.create(:user, lms_user_id: BOB3_LMS_USER_ID)
    @section = FactoryGirl.create(:section, course: @course, lms_section_id: LMS_SECTION_ID)
  end

  it { should belong_to(:course) }
  it { should have_many(:user_courses) }

  describe "sync_students" do

    def do_sync_students
      VCR.use_cassette("sync_students", :match_requests_on => [:path]) do
        @section.sync_students
      end
      @section.reload
    end

    before do
      do_sync_students
    end

    it "should update student names" do
      student = @section.students.last
      name = student.name
      student.update_attribute(:name, "Prince Edward")
      do_sync_students
      expect(student.reload.name).to eq(name)
    end

    it "should get the initials for the student" do
      student = @section.students.last
      expect(student.initials).to eq(User.convert_name_to_initials(student.sortable_name))
    end

    it "should add a student and a user_course for students that aren't already in the database" do
      old_number_of_users = @section.students.count
      old_number_of_user_courses_in_section = @section.students.count
      @section.user_courses.last.destroy

      expect(@section.students.count).to eq(old_number_of_users - 1)
      expect(@section.user_courses.count).to eq(old_number_of_user_courses_in_section - 1)

      do_sync_students
      @section.reload
      expect(@section.students.count).to eq(old_number_of_users)
      expect(@section.user_courses.count).to eq(old_number_of_user_courses_in_section)
    end
    it "should add user_courses for students that are in the db but not in the section" do
      old_number_of_users = User.count
      old_number_of_user_courses_in_section = @section.students.count
      @section.user_courses.last.destroy
      expect(User.count).to eq(old_number_of_users)
      expect(@section.user_courses.count).to eq(old_number_of_user_courses_in_section - 1)

      do_sync_students
      @section.reload
      expect(User.count).to eq(old_number_of_users)
      expect(@section.user_courses.count).to eq(old_number_of_user_courses_in_section)
    end
    it "should destroy the user_courses for students that are no longer in the section" do
      old_number_of_user_courses_in_section = @section.students.count
      user_course = FactoryGirl.create(:user_course, section: @section)
      expect(@section.user_courses.count).to eq(old_number_of_user_courses_in_section + 1)
      do_sync_students
      @section.reload
      expect(@section.user_courses.count).to eq(old_number_of_user_courses_in_section)
    end
    it "should not destroy the student for students who are no longer in the class" do
      old_number_of_users = @section.course.account.users.count
      old_number_of_user_courses_in_section = @section.students.count
      user_course = FactoryGirl.create(:user_course, section: @section)
      expect(@section.user_courses.count).to eq(old_number_of_user_courses_in_section + 1)
      do_sync_students
      @section.reload
      expect(@section.course.account.users.count).to eq(old_number_of_users)
    end
  end
end