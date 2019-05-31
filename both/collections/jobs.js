Jobs = new Mongo.Collection("jobs");

//Meteor.startup(function () {

 Schemaj= new SimpleSchema({
    title: {
      type: String,
      label: ()=>TAPi18n.__("l_jtitle",{}),
      max: 128,
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_jtitle")
                }
            }
    },
    company: {
      type: String,
      label: ()=>TAPi18n.__("l_company"),
      max: 128,
      optional: true,
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_company")
                }
            }
    },
    location: {
      type: String,
      label: "Location",
      label: ()=>TAPi18n.__("l_location"),
      max: 128,
      optional: true,
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("l_location")
                }
            }
    },
    url: {
      type: String,
      label: "URL",
      label: ()=>TAPi18n.__("l_url"),
      max: 256,
      optional: true,
      regEx: SimpleSchema.RegEx.Url,
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_url")
                }
            }
    },
    contact: {
      type: String,
      label: "Contact Info",
      label: ()=>TAPi18n.__("l_contactinfo"),
      max: 128,
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_contactinfo")
                }
            }
    },
    
    jobtype: {
      type: String,
      label: ()=>TAPi18n.__("l_jobtype"),
      allowedValues: JOB_TYPES,
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
    remote: {
      type: Boolean,
      label: ()=>TAPi18n.__("l_remote")
    },
    userId: {
      type: String,
      label: ()=>TAPi18n.__("l_userid"),
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
      autoform: {
                afFieldInput: {
                    placeholder: ()=>TAPi18n.__("p_userid")
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
      
    },
    description: {
      type: String,
      label: ()=>TAPi18n.__("l_jdescription"),
      max: 20000,
      autoform: {
        afFieldInput: SUMMERNOTE_OPTIONS
      }
    },
    status: {
      type: String,
      allowedValues: STATUSES,
      autoValue: function() {
        if (this.isInsert) {
          return 'pending';
        } else if (this.isUpsert) {
          return {
            $setOnInsert: 'pending'
          };
        }
      },
    },
    featuredThrough: {
      type: Date,
      optional: true
    },
    featuredChargeHistory: {
      type: [String],
      optional: true
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
  });
//Jobs.attachSchema(Schemaj);
if(Meteor.isClient){
  Jobs.attachSchema(Schemaj);
}
Jobs.helpers({
  path: function() {
    return 'jobs/' + this._id + '/' + this.slug();
  },
  slug: function() {
    return getSlug(this.title);
  },
  featured: function() {
    return this.featuredThrough && moment().isBefore(this.featuredThrough);
  },
  featuredAllowed: function() {
    return this.status === "pending" || this.status === "active";
  }
});

Jobs.allow({
  insert: function(userId, doc) {
    return userId && doc && userId === doc.userId;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return Roles.userIsInRole(userId, ['admin']) ||
      (!_.contains(fieldNames, 'htmlDescription') && !_.contains(fieldNames, 'status') && !_.contains(fieldNames, 'featuredThrough') && !_.contains(fieldNames, 'featuredChargeHistory') && /*doc.status === "pending" &&*/ userId && doc && userId === doc.userId);
  },
  remove: function(userId, doc) {
    return false;
  },
  fetch: ['userId', 'status']
});
//