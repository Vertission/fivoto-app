import {
  AWS_REGION,
  AWS_COGNITO_IDENTITY_POOL_ID,
  AWS_USER_POOLS_ID,
  AWS_USER_POOLS_WEB_CLIENT_ID,
  AWS_BUCKET,
} from '@env';

export default {
  aws_project_region: AWS_REGION,
  aws_cognito_identity_pool_id: AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: AWS_REGION,
  aws_user_pools_id: AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id: AWS_USER_POOLS_WEB_CLIENT_ID,
  aws_user_files_s3_bucket: AWS_BUCKET,
  aws_user_files_s3_bucket_region: AWS_REGION,
};
