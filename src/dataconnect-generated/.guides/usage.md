# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createQuiz, getPublicQuizzes, submitQuizAttempt, getMyQuizAttempts } from '@dataconnect/generated';


// Operation CreateQuiz: 
const { data } = await CreateQuiz(dataConnect);

// Operation GetPublicQuizzes: 
const { data } = await GetPublicQuizzes(dataConnect);

// Operation SubmitQuizAttempt:  For variables, look at type SubmitQuizAttemptVars in ../index.d.ts
const { data } = await SubmitQuizAttempt(dataConnect, submitQuizAttemptVars);

// Operation GetMyQuizAttempts: 
const { data } = await GetMyQuizAttempts(dataConnect);


```