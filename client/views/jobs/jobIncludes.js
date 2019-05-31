Template.jobExpiredAlert.helpers({
  expired: function() {
    if (this.userId === Meteor.userId()) {
      if ((this.createdAt < daysUntilExpiration()) && (this.updatedAt < daysUntilExpiration())) {
        return true;
      } else if ((this.createdAt < daysUntilExpiration()) && (this.updatedAt === undefined)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
});

Template.jobStatusToggle.helpers({
  "statuses": function() {
    return STATUSES;
  }
});
Template.jobLabels.helpers({
  'trans': function(str) {
    if(str==='type'){
      return TAPi18n.__(this.jobtype);
    }
    else{
      return TAPi18n.__(str);
    }

    // console.log(str);
    // console.log(this);
    
  }
});

Template.jobStatusToggle.events({
  "click .set-status": function(event, template) {
    event.preventDefault();
    Meteor.call("adminSetJobStatus", template.data._id, String(this));
  }
});


Template.jobFeatured.events({
  "click #buy-featured": function(event, template) {
    event.preventDefault();
    var job = template.data;
    var btn = $(event.currentTarget);
    btn.button('loading');
    StripeCheckout.open({
      key: Meteor.settings.public.Stripe.pubKey,
      name: 'JObar',
      billingAddress: false,
      allowRememberMe: true,
      description: 'Featured Job Post - 30 Days',
      currency: "usd",
      amount: 10000,
      email: getUserEmail(Meteor.user()),
      closed: function() {
        btn.button('reset');
      },
      token: function(token, args) {
        //console.log(token);
        Meteor.call("createFeaturedJobCharge", token.id, job._id, function(error, result) {
          if (error) {
            console.log("Insert Error:", error);
          } else {
            console.log(result);
            // Router.go("orders");
            //successNotification('Card Saved');
          }
          btn.button('reset');
        });
      }
    });
  }
});
