const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'quizhub',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createQuizRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateQuiz');
}
createQuizRef.operationName = 'CreateQuiz';
exports.createQuizRef = createQuizRef;

exports.createQuiz = function createQuiz(dc) {
  return executeMutation(createQuizRef(dc));
};

const getPublicQuizzesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublicQuizzes');
}
getPublicQuizzesRef.operationName = 'GetPublicQuizzes';
exports.getPublicQuizzesRef = getPublicQuizzesRef;

exports.getPublicQuizzes = function getPublicQuizzes(dc) {
  return executeQuery(getPublicQuizzesRef(dc));
};

const submitQuizAttemptRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SubmitQuizAttempt', inputVars);
}
submitQuizAttemptRef.operationName = 'SubmitQuizAttempt';
exports.submitQuizAttemptRef = submitQuizAttemptRef;

exports.submitQuizAttempt = function submitQuizAttempt(dcOrVars, vars) {
  return executeMutation(submitQuizAttemptRef(dcOrVars, vars));
};

const getMyQuizAttemptsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyQuizAttempts');
}
getMyQuizAttemptsRef.operationName = 'GetMyQuizAttempts';
exports.getMyQuizAttemptsRef = getMyQuizAttemptsRef;

exports.getMyQuizAttempts = function getMyQuizAttempts(dc) {
  return executeQuery(getMyQuizAttemptsRef(dc));
};
