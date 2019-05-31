Profiles = new Mongo.Collection("experts"); //todo - rename underlying collection to reflect code refactor
//Meteor.startup(function() {

Profiles.attachSchema(
  new SimpleSchema({
    userId: {
      type: String,
      autoValue: function() {
        if (this.isInsert) {
          return Meteor.userId();
        } else if (this.isUpsert) {
          return {
            $setOnInsert: Meteor.userId()
          };
        } else {
          this.unset();
        }
      },
      denyUpdate: true
    },
    userName: {
      type: String,
      label: ()=>TAPi18n.__("l_username"),
      autoValue: function() {
        if (this.isInsert) {
          return getUserName(Meteor.user());
        } else if (this.isUpsert) {
          return {
            $setOnInsert: getUserName(Meteor.user())
          };
        } else {
          this.unset();
        }
      },
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_username")
                }
            }
    },
    customImageUrl: {
      type: String,
      optional: true
    },
    name: {
      type: String,
      label: ()=>TAPi18n.__("l_name"),
      max: 128,
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_name")
                }
            }
    },
    type: {
      type: String,
      label: ()=>TAPi18n.__("l_type"),
      allowedValues: ["Individual","Company"],
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_type")
                },
                options: [{
          label: ()=>TAPi18n.__("opt_type_individual"),
          value: "Individual"
        },
        {
          label: ()=>TAPi18n.__("opt_type_company"),
          value: "Company"
        }
        
      ]
            }
    },
    title: {
      type: String,
      label: ()=>TAPi18n.__("l_title"),
      max: 128,
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_title")
                }
            }
    },
    location: {
      type: String,
      label: ()=>TAPi18n.__("l_location"),
      max: 256,
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_location")
                }
            }
    },
    description: {
      type: String,
      label: ()=>TAPi18n.__("l_description"),
      max: 10000,
      autoform: {
        afFieldInput: SUMMERNOTE_OPTIONS,
      }
    },
    // Automatically set HTML content based on markdown content
    // whenever the markdown content is set.
    htmlDescription: {
      type: String,
      optional: true,
      autoValue: function(doc) {
        var htmlContent = this.field("description");
        if (Meteor.isServer && htmlContent.isSet) {
          return cleanHtml(htmlContent.value);
        }
      }
    },
    availableForHire: {
      type: Boolean,
      label: ()=>TAPi18n.__("l_availability"),
      defaultValue: false
    },
    interestedIn: {
      type: [String],
      label: ()=>TAPi18n.__("l_interested"),
      allowedValues: JOB_TYPES,
      optional: true,
      autoform: {
      
      options: [{
          label: ()=>TAPi18n.__("jt_full"),
          value: "Full Time"
        },
        {
          label: ()=>TAPi18n.__("jt_ptime"),
          value: "Part Time"
        },
        {
          label: ()=>TAPi18n.__("jt_hour"),
          value: "Hourly Contract"
        },
        {
          label: ()=>TAPi18n.__("jt_term"),
          value: "Term Contract"
        },
        {
          label: ()=>TAPi18n.__("jt_mentoring"),
          value: "Mentoring"
        },
        {
          label: ()=>TAPi18n.__("jt_intern"),
          value: "Internship"
        },
        {
          label: ()=>TAPi18n.__("jt_bounty"),
          value: "Bounty"
        },
        {
          label: ()=>TAPi18n.__("jt_volunteer"),
          value: "Volunteer"
        },
        {
          label: ()=>TAPi18n.__("jt_other"),
          value: "Other"
        }
      ]
    }
    },
    contact: {
      type: String,
      label: ()=>TAPi18n.__("l_contact"),
      max: 1024,
      optional: true,
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_contact")
                }
            }
    },
    url: {
      type: String,
      label: ()=>TAPi18n.__("l_personalurl"),
      max: 1024,
      optional: true,
      regEx: SimpleSchema.RegEx.Url,
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_personalurl")
                }
            }
    },
    resumeUrl: {
      type: String,
      label: ()=>TAPi18n.__("l_resumeurl"),
      max: 1024,
      optional: true,
      regEx: SimpleSchema.RegEx.Url,
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_resumeurl")
                }
            }
    },
    githubUrl: {
      type: String,
      label: ()=>TAPi18n.__("l_githuburl"),
      max: 1024,
      optional: true,
      regEx: SimpleSchema.RegEx.Url,
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_githuburl")
                }
            }
    },
    linkedinUrl: {
      type: String,
      label: ()=>TAPi18n.__("l_linkedinurl"),
      max: 1024,
      optional: true,
      regEx: SimpleSchema.RegEx.Url,
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_linkedinurl")
                }
            }
    },
    stackoverflowUrl: {
      type: String,
      label: ()=>TAPi18n.__("p_stackoverflowurl"),
      max: 1024,
      optional: true,
      regEx: SimpleSchema.RegEx.Url,
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("l_stackoverflowurl")
                }
            }
    },
    randomSorter: {
      type: Number,
      defaultValue: Math.floor(Math.random() * 10000)
    },
    status: {
      type: String,
      allowedValues: PROFILE_STATUSES,
      defaultValue: "active"
    },
    // Force value to be current date (on server) upon insert
    // and prevent updates thereafter.
    createdAt: {
      type: Date,
      autoValue: function() {
        if (this.isInsert) {
          return new Date();
        } else if (this.isUpsert) {
          return {
            $setOnInsert: new Date()
          };
        } else {
          this.unset();
        }
      },
      denyUpdate: true
    },
    // Force value to be current date (on server) upon update
    // and don't allow it to be set upon insert.
    updatedAt: {
      type: Date,
      autoValue: function() {
        if (this.isUpdate) {
          return new Date();
        }
      },
      denyInsert: true,
      optional: true
    }
  })
);

if (Meteor.isServer) {
  Profiles._ensureIndex({
    "userName": "text",
    "name": "text",
    "title": "text",
    "description": "text",
    "location": "text"
  });
}

Profiles.helpers({
  displayName: function() {
    return this.name || this.userName;
  },
  path: function() {
    return 'profiles/' + this._id + '/' + this.slug();
  },
  slug: function() {
    return getSlug(this.displayName() + ' ' + this.title);
  }
});

Profiles.allow({
  insert: function(userId, doc) {
    return userId && doc && userId === doc.userId;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return Roles.userIsInRole(userId, ['admin']) || (!_.contains(fieldNames, 'randomSorter') && !_.contains(fieldNames, 'htmlDescription') && !_.contains(fieldNames, 'status') && userId && doc && userId === doc.userId);
  },
  remove: function(userId, doc) {
    return Roles.userIsInRole(userId, ['admin']) || (userId && doc && userId === doc.userId);
  },
  fetch: ['userId']
});
