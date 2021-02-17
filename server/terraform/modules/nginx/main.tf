terraform {
  required_providers {
    sshcommand = {
      source  = "invidian/sshcommand"
      version = "0.2.0"
    }
  }
}

variable "user" {
  type = string
}

variable "host" {
  type = string
}

variable "private_key" {
  type = string
}

variable "ssl_name" {
  type = string
}

resource "sshcommand_command" "nginx_conf" {
  user        = var.user
  host        = var.host
  private_key = var.private_key
  command     = <<END_OF_COMMAND
cat <<END_OF_SHELL | sh
set -euxo pipefail
sudo amazon-linux-extras install nginx1 -y
exoprt NGINX_SSL_NAME=${var.ssl_name}

cat <<END_OF_NGINX_TEMPLATE > nginx-template.sh
${file("${path.module}/nginx-template.sh")}
END_OF_NGINX_TEMPLATE

sh nginx-template.sh > stage.nginx.conf

nginx -t -c "$(pwd)/stage.nginx.conf"
sudo cp stage.nginx.conf /etc/nginx/nginx.conf
sudo systemctl reload nginx.service
END_OF_SHELL
END_OF_COMMAND
}
