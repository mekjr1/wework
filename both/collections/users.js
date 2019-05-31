Users = Meteor.users;
Meteor.startup(function() {
UserProfileSchema = new SimpleSchema({
  name: {
    type: String,
    label: ()=>TAPi18n.__("l_fname"),
    max: 64,
    optional: true,
    autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_fname")
                }
            }
  }
});

UserSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  username: {
    type: String,
    optional: true,
    autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_username")
                }
            }
  },
  emails: {
    type: [Object],
    // this must be optional if you also use other login services like facebook,
    // but if you use only accounts-password, then it can be required
    optional: true,
    autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_email")
                }
            }
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: ()=>TAPi18n.__("l_email")
  },
  "emails.$.verified": {
    type: Boolean,
    defaultValue: false
  },
  emailHash: {
    type: String,
    optional: true
  },
  isDeveloper: {
    type: Boolean,
    defaultValue: false
  },
  createdAt: {
    type: Date
  },
  profile: {
    type: UserProfileSchema,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  roles: {
    type: Array,
    optional: true
  },
  "roles.$": {
    type: String
  },
  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true,
  }
});

Users.attachSchema(UserSchema);

Users.allow({
  insert: function(userId, doc) {
    return false;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return Roles.userIsInRole(userId, ['admin']) || (!_.contains(fieldNames, 'roles') && userId && doc && userId === doc.userId);
  },
  remove: function(userId, doc) {
    return false;
  },
  fetch: ['userId']
});
});