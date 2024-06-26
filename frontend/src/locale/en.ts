export const messagesEn = {
  auth: {
    login: 'Login',
    loginInProgress: 'Logging in ...',
    register: 'Register',
    logout: 'Log out',
  },
  dashboard: {
    actions: {
      newLabel: 'New label',
      newReport: 'New report',
    },
    hello: 'Hello {displayName}!',
    recentReports: 'Recent reports',
  },
  design: 'Design',
  error: {
    badRequest: 'Bad request',
    conflict: 'Conflict',
    error: 'Error',
    failedToLoad: 'Failed to load',
    internalServerError: 'Internal server error',
    notFound: 'Not found',
    unauthorized: 'Unauthorized',
    unknownReason: 'Unknown reason',
  },
  general: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    confirmation: 'Confirmation',
    copyToClipboard: {
      copyToClipboard: 'Copy to clipboard',
      fail: 'Copying to clipboard failed',
      success: 'Copied to clipboard',
    },
    delete: 'Delete',
    deleted: 'Deleted',
    deleting: 'Deleting ...',
    name: 'Name',
    reload: 'Reload',
    save: 'Save',
    saved: 'Saved',
    saving: 'Saving ...',
    search: 'Search',
  },
  label: {
    create: {
      button: 'Create',
      modalTitle: 'Create label',
    },
    edit: {
      button: 'Save',
      modalTitle: 'Edit label',
    },
    delete: {
      associatedValues: 'This label has 1 associated value. That value will also be deleted! ' +
        '| This label has {count} associated values. Those values will also be deleted!',
      reallyDelete: 'Really delete this label?',
    },
    label: 'Label',
    list: {
      actions: 'Actions',
      createdAt: 'Created at',
      updatedAt: 'Last update',
    },
    missingInformation: 'Missing information',
    model: {
      color: 'Color',
      description: 'description',
      maxReference: 'Maximum reference',
      minReference: 'Minimum reference',
      name: 'Name',
      unit: 'Unit',
    },
    reference: 'Reference',
  },
  locale: 'Language',
  locales: {
    'de': 'Deutsch',
    'en': 'English',
  },
  menu: {
    about: 'About',
    labels: 'Labels',
    main: 'Dashboard',
    profile: 'Profile',
    reports: 'Reports',
    settings: 'Settings',
    values: 'Values',
  },
  report: {
    delete: {
      associatedValues: 'This report has 1 associated value. That value will also be deleted! ' +
        '| This report has {count} associated values. Those values will also be deleted!',
      reallyDelete: 'Really delete this report?',
    },
    list: {
      actions: 'Actions',
      createdAt: 'Created at',
      updatedAt: 'Last update',
    },
    model: {
      comment: 'Comment',
      date: 'Date',
      lab: 'Lab',
      name: 'Name',
    },
    report: 'Report',
    valueCount: '#values',
    valueCountShort: '#',
  },
  settings: {
    settings: 'Settings',
    currentlyNoSettings: 'Currently there are no settings.',
  },
  validation: {
    patternMismatch: 'Input does not match pattern! "{pattern}".',
    rangeOverflow: 'Input is too large! Maximum value {max}.',
    rangeUnderflow: 'Input is too small! Minimum value {min}.',
    tooLong: 'Input is too long! Maximum length {maxLength}.',
    tooShort: 'Input is too short! Minimum length {minLength}.',
    typeMismatch: {
      email: 'Please enter a valid email address!',
      unknown: 'Invalid input for type {type}!'
    },
    unknown: 'Unknown validation error!',
    valueMissing: 'This field is required!',
  },
  value: {
    delete: {
      reallyDelete: 'Really delete this value?',
    },
    edit: {
      button: 'Save',
      modalTitle: 'Edit value',
    },
    list: {
      actions: 'Actions',
      createdAt: 'Created at',
      updatedAt: 'Last update',
    },
    model: {
      labelId: 'Label',
      value: 'Value',
    },
  },
  userinfo: {
    model: {
      displayName: 'Display name',
      email: 'Email',
      name: 'Name',
    },
    password: 'Password',
    passwordRepeat: 'Password (repeat)',
    passwordsDoNotMatch: 'Passwords do not match',
  },
};

export const datetimeFormatsEn = {
  date: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
  datetime: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  },
  datetimeSeconds: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    seconds: '2-digit',
  },
};