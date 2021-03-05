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

variable "dc_version" {
  type = string
}

resource "sshcommand_command" "install_docker_compose" {
  user        = var.user
  host        = var.host
  private_key = var.private_key
  command     = <<END_OF_COMMAND
cat <<'END_OF_SHELL' | bash || true
set -euxo pipefail

DC_VERSION="${var.dc_version}"
sudo curl -L "https://github.com/docker/compose/releases/download/$DC_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

END_OF_SHELL
END_OF_COMMAND
}

output "result" {
  value = sshcommand_command.install_docker_compose.result
}
