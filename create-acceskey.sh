#!/bin/bash

# 必要な変数を設定
DISTRIBUTION_ID=$1
if [ -z "$DISTRIBUTION_ID" ]; then
  echo "Usage: $0 <distribution_id>"
  exit 1
fi
ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
POLICY_NAME="CloudFrontInvalidationPolicy-$DISTRIBUTION_ID"
USER_NAME="CFInvalidationUser-$DISTRIBUTION_ID"
POLICY_ARN=""

# ポリシーのJSONを一時ファイルに保存
POLICY_DOCUMENT=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": ["cloudfront:GetInvalidation", "cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::$ACCOUNT_ID:distribution/$DISTRIBUTION_ID"
    }
  ]
}
EOF
)

echo "$POLICY_DOCUMENT" > temp_policy.json

# ポリシーを作成
aws iam create-policy --policy-name $POLICY_NAME --policy-document file://temp_policy.json

# ポリシーARNを取得
POLICY_ARN=$(aws iam list-policies --query "Policies[?PolicyName=='$POLICY_NAME'].Arn" --output text)

# ユーザーを作成
aws iam create-user --user-name $USER_NAME

# ポリシーをユーザーにアタッチ
aws iam attach-user-policy --user-name $USER_NAME --policy-arn $POLICY_ARN

# 一時ファイルを削除
rm temp_policy.json

# アクセスキーを作成し、結果をJSONで取得
ACCESS_KEYS_JSON=$(aws iam create-access-key --user-name $USER_NAME)

# アクセスキーIDとシークレットアクセスキーを抽出
ACCESS_KEY_ID=$(echo $ACCESS_KEYS_JSON | jq -r '.AccessKey.AccessKeyId')
SECRET_ACCESS_KEY=$(echo $ACCESS_KEYS_JSON | jq -r '.AccessKey.SecretAccessKey')

# アクセスキーIDとシークレットアクセスキーを表示
echo "AccessKeyId: $ACCESS_KEY_ID"
echo "SecretAccessKey: $SECRET_ACCESS_KEY"
