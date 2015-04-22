require 'active_record'
require 'activerecord-import'
require 'yaml'

yaml_path = "/Users/chck/Work/cerebro/config.yml"
conf = YAML::load_file(yaml_path)
ActiveRecord::Base.establish_connection(conf["mysql"]["prd"])
# ActiveRecord::Base.establish_connection($conf["mysql"]["dev"])
class Twitterer < ActiveRecord::Base
end
