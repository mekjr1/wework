Profiles.after.insert(function(userId, doc) {
  Users.update({
    _id: doc.userId
  }, {
    $set: {
      isDeveloper: true
    }
  });
});

Profiles.after.remove(function(userId, doc) {
  Users.update({
    _id: doc.userId
  }, {
    $set: {
      isDeveloper: false
    }
  });
});

Jobs.after.insert(function(userId, doc) {
  var admin = Users.findOne({ roles: "admin" });
  Email.send({
    to: getUserEmail(admin),
    from: FROM_EMAIL,
    subject: ()=>TAPi18n.__("new_job_alert") + doc.title,
    text: ()=>TAPi18n.__("job_needs_approval_alert")+": \n\n" + Meteor.absoluteUrl("jobs/" + doc._id) + "\n\n\n\n\n\n"
  });
});
