# packer {
#   required_plugins {
#     amazon = {
#       version = ">= 1.1.1"
#       source  = "github.com/hashicorp/amazon"
#     }
#   }
# }

locals {
  timestamp = regex_replace(timestamp(), "[- TZ:]", "")
}

//Variables:

variable "region" {
  default = "us-east-1"
  type    = string
}

variable "instanceType" {
  default = "t2.micro"
  type    = string
}

variable "sshUserName" {
  default = "ec2-user"
  type    = string
}

variable "profile" {
  default = "dev"
  type    = string
}

variable "amiName" {
  default = "web-app"
  type    = string
}

variable "AWS_SECRET_ACCESS_KEY" {
  default = "${env("AWS_SECRET_ACCESS_KEY")}"
  type    = string
}

variable "AWS_ACCESS_KEY_ID" {
  default = "${env("AWS_ACCESS_KEY_ID")}"
  type    = string
}

variable "amiUser" {
  default = ["146721225773"]
  type    = list(string)
}



source "amazon-ebs" "webapp" {
  ami_name = "webapp - ${local.timestamp}"

  source_ami_filter {
    filters = {
      virtualization-type = "hvm"
      name                = "amzn2-ami-kernel-5.10-hvm-2.*.0-x86_64-gp2"
      root-device-type    = "ebs"
    }
    owners      = ["137112412989"]
    most_recent = true
  }
  profile       = "${var.profile}"
  instance_type = "${var.instanceType}"
  region        = "${var.region}"
  ssh_username  = "${var.sshUserName}"
  access_key    = "${var.AWS_ACCESS_KEY_ID}"
  secret_key    = "${var.AWS_SECRET_ACCESS_KEY}"
  ami_users     = "${var.amiUser}"


  launch_block_device_mappings {
    device_name           = "/dev/xvda"
    volume_type           = "gp2"
    volume_size           = 50
    delete_on_termination = true
  }

}



build {
  sources = [
    "source.amazon-ebs.webapp"
  ]

  provisioner "file" {
    source      = "webapp.zip"
    destination = "~/"
  }

  provisioner "file" {
    source      = "setup.sh"
    destination = "~/"
  }

  provisioner "file" {
    source      = "app.sh"
    destination = "~/"
  }

  provisioner "file" {
    source      = "file.sh"
    destination = "~/"
  }

  provisioner "file" {
    source      = "database.sh"
    destination = "~/"
  }


  provisioner "shell" {
    inline = [
      "pwd",
      "ls -a -l",
      "sudo bash ~/setup.sh",
      "sudo bash ~/database.sh",
      "sudo bash ~/file.sh",
      "sudo bash ~/app.sh",
    ]
  }

}
