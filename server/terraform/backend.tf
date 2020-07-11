terraform {
  backend s3 {
    bucket = "dgl-terraform-state"
    region  = "ap-northeast-1"
    profile = "terrformer"
    key    = "terraform.tfstate"
  }
}

resource aws_s3_bucket terraform_state {
  bucket = "dgl-terraform-state"
  versioning {
    enabled = true
  }
}

