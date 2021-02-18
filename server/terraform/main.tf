variable "public_key" {}
variable "private_key" {}
variable "ssl_certificate" {}
variable "ssl_certificate_key" {}
variable "tags" {
  default = {
    Name = "dgl.jp"
  }
}

resource "aws_vpc" "dgl_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags                 = var.tags
}

resource "aws_internet_gateway" "dgl_gw" {
  vpc_id = aws_vpc.dgl_vpc.id
  tags   = var.tags
}

resource "aws_subnet" "dgl_subnet" {
  vpc_id            = aws_vpc.dgl_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "ap-northeast-1a"
  tags              = var.tags
}

resource "aws_route_table" "dgl_route" {
  vpc_id = aws_vpc.dgl_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.dgl_gw.id
  }
  tags = var.tags
}

resource "aws_route_table_association" "dgl_association" {
  subnet_id      = aws_subnet.dgl_subnet.id
  route_table_id = aws_route_table.dgl_route.id
}

resource "aws_security_group" "dgl_sec" {
  name        = "${var.tags.Name} admin"
  description = "Allow SSH and HTTP traffic"
  vpc_id      = aws_vpc.dgl_vpc.id
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = var.tags
}

resource "aws_security_group_rule" "dgl_inbound_ssh" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.dgl_sec.id
}

resource "aws_security_group_rule" "dgl_inbound_https" {
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.dgl_sec.id
}

data "aws_ssm_parameter" "amzn2_ami" {
  name = "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2"
}

resource "aws_key_pair" "auth" {
  key_name   = var.tags.Name
  public_key = var.public_key
  tags       = var.tags
}

resource "aws_ebs_snapshot" "ebs_snapshot" {
  volume_id = aws_instance.dgl_instance.root_block_device.0.volume_id
  tags      = var.tags
}

resource "aws_instance" "dgl_instance" {
  ami           = data.aws_ssm_parameter.amzn2_ami.value
  instance_type = "t3a.micro"
  key_name      = aws_key_pair.auth.id
  vpc_security_group_ids = [
    aws_security_group.dgl_sec.id
  ]
  subnet_id                   = aws_subnet.dgl_subnet.id
  associate_public_ip_address = true
  root_block_device {
    volume_type           = "gp2"
    volume_size           = 10
    delete_on_termination = false
  }
  tags        = var.tags
  volume_tags = var.tags

  provisioner "remote-exec" {
    connection {
      user        = "ec2-user"
      host        = self.public_ip
      private_key = var.private_key
    }
    inline = [
      "sudo yum update -y",
      "sudo yum install -y docker",
      "sudo service docker start",
      "sudo usermod -a -G docker ec2-user",
      "sudo curl -L https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose",
      "sudo chmod +x /usr/local/bin/docker-compose",
      "sudo yum install git -y",
      # "sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000",
      "git clone https://github.com/DigitalGovernmentLabs/dgl-info.git",
      "sudo amazon-linux-extras install nginx1 -y",
      "sudo touch /etc/ssl/${var.tags.Name}.pem",
      "echo \"${var.ssl_certificate}\" | sudo tee /etc/ssl/${var.tags.Name}.pem > /dev/null",
      "sudo touch /etc/ssl/${var.tags.Name}.key",
      "echo \"${var.ssl_certificate_key}\" | sudo tee /etc/ssl/${var.tags.Name}.key > /dev/null",
      "sudo touch /etc/nginx/nginx.conf",
    ]
  }
}

module "nginx" {
  source = "./modules/nginx"

  user        = "ec2-user"
  host        = aws_instance.dgl_instance.public_ip
  private_key = var.private_key
  ssl_name    = var.tags.Name
}

output "nginx_result" {
  value = module.nginx.result
}

resource "aws_eip" "dgl_eip" {
  instance = aws_instance.dgl_instance.id
  vpc      = true
  tags     = var.tags
}
