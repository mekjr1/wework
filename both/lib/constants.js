//JOB_TYPES = ["Full Time", "Part Time", "Hourly Contract", "Term Contract", "Mentoring", "Internship", "Bounty", "Open Source", "Volunteer", "Other"];

JOB_TYPES = [TAPi18n.__("jt_full"),TAPi18n.__("jt_ptime"),TAPi18n.__("jt_hour"), TAPi18n.__("jt_term"), TAPi18n.__("jt_mentoring"),TAPi18n.__("jt_intern"),TAPi18n.__("jt_bounty"), TAPi18n.__("jt_volunteer"), TAPi18n.__("jt_other")];

SUMMERNOTE_OPTIONS = {
  type: 'summernote',
  height: 300,
  minHeight: 300,
  toolbar: [
    ['style', ['style']],
    ['font', ['bold', 'italic', 'underline', 'clear']],
    ['para', ['ul', 'ol']],
    ['insert', ['link', 'hr']],
    ['misc', ['codeview']]
  ],
  styleWithSpan: false
};

STATUSES = ["pending", "active", "flagged", "inactive", "filled"];
PROFILE_STATUSES = ["active", "flagged"];
