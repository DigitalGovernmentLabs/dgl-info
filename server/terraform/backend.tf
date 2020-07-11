resource aws_s3_bucket terraform_state {
  bucket = "dgl-terraform-state"
  versioning {
    enabled = true
  }
}

terraform {
  backend s3 {
    bucket = "dgl-terraform-state"
    key    = "terraform.tfstate"
  }
}
