describe "generate students" do
  user_count = ARGV[1] ? ARGV[1].to_i : 20

  user_count.times do
    user = {}
    pseudonym = {}

    user_first_name = Faker::Name.first_name
    user_last_name = Faker::Name.last_name

    user["name"] = "#{user_first_name} #{user_last_name}"
    user["short_name"] = user_first_name
    user["sortable_name"] = "#{user_last_name}, #{user_first_name}"
    user["terms_of_use"] = true
    # Sets the user to registered w/o sending the confirmation email
    user["skip_registration"] = true
    pseudonym["unique_id"] = Faker::Internet.safe_email
    pseudonym["password"] = "asdfasdf"
    # pseudonym[sis_user_id]
    user["avatar"] = {}
    user["avatar"]["url"] = Faker::Avatar.image
  end


end
