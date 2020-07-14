## Setting

TerraformのState管理用にS3バケットを手動で作る
bucket name: dgl-terraform-state
versioning: true
tags: Name = dgl.jp

## run from local

terraform.tfvars
```
aws_access_key = "AKIAXXXXXXXXXXXXXXXXXX"
aws_secret_key = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
public_key = ""
private_key = ""
```

provider.tf
```
variable aws_access_key {}
variable aws_secret_key {}

provider aws {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region = "ap-northeast-1"
}
```

$ docker run --rm -v $PWD:/work -w /work hashicorp/terraform:light \<command>
