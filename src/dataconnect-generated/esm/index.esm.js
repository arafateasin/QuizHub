import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'quizhub',
  location: 'us-east4'
};

export const createQuizRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateQuiz');
}
createQuizRef.operationName = 'CreateQuiz';

export function createQuiz(dc) {
  return executeMutation(createQuizRef(dc));
}

export const getPublicQuizzesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublicQuizzes');
}
getPublicQuizzesRef.operationName = 'GetPublicQuizzes';

export function getPublicQuizzes(dc) {
  return executeQuery(getPublicQuizzesRef(dc));
}

export const submitQuizAttemptRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SubmitQuizAttempt', inputVars);
}
submitQuizAttemptRef.operationName = 'SubmitQuizAttempt';

export function submitQuizAttempt(dcOrVars, vars) {
  return executeMutation(submitQuizAttemptRef(dcOrVars, vars));
}

export const getMyQuizAttemptsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyQuizAttempts');
}
getMyQuizAttemptsRef.operationName = 'GetMyQuizAttempts';

export function getMyQuizAttempts(dc) {
  return executeQuery(getMyQuizAttemptsRef(dc));
}

