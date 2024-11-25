import { mainWorkflow } from './workflows/MainWorkflow';

mainWorkflow().catch((error) => console.error('Error in workflow:', error.message));