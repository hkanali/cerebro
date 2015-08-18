require 'active_record'
require 'activerecord-import'
require 'yaml'

yaml_path = "#{__dir__}/../../config.yml"
conf = YAML::load_file(yaml_path)
ActiveRecord::Base.establish_connection(conf["mysql"]["prd"])
# ActiveRecord::Base.establish_connection($conf["mysql"]["dev"])
class SocialRelation < ActiveRecord::Base
end
