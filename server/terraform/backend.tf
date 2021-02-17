terraform {
  backend "s3" {
    bucket = "dgl-terraform-state"
    key    = "terraform.tfstate"
  }
}
