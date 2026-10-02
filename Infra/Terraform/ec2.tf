data "aws_ami" "ubuntu_arm64" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-arm64-server-*"]
  }

  filter {
    name   = "architecture"
    values = ["arm64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_key_pair" "juracema" {
  key_name   = var.ec2_key_name
  public_key = file(pathexpand(var.ssh_public_key_path))

  tags = {
    Project       = "Juracema-System"
    Environment   = "Portfolio"
    ProvisionedBy = "Terraform"
  }
}

resource "aws_instance" "juracema" {
  ami                         = data.aws_ami.ubuntu_arm64.id
  instance_type               = "t4g.micro"
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.juracema.id]
  key_name                    = aws_key_pair.juracema.key_name
  iam_instance_profile        = aws_iam_instance_profile.ec2.name
  associate_public_ip_address = true
  root_block_device {
    volume_type = "gp3"
    volume_size = 15
    encrypted   = true
  }

  tags = {
    Name          = "juracema-web"
    Project       = "Juracema-System"
    Environment   = "Portfolio"
    ProvisionedBy = "Terraform"
  }
}

resource "aws_eip" "juracema" {
  domain = "vpc"

  tags = {
    Name          = "juracema-eip"
    Project       = "Juracema-System"
    Environment   = "Portfolio"
    ProvisionedBy = "Terraform"
  }
}

resource "aws_eip_association" "juracema" {
  instance_id   = aws_instance.juracema.id
  allocation_id = aws_eip.juracema.id
}