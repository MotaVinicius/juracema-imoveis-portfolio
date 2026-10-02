resource "aws_vpc" "juracema" {
  cidr_block           = "10.20.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name          = "juracema-vpc"
    Project       = "Juracema-System"
    Environment   = "Portfolio"
    ProvisionedBy = "Terraform"
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.juracema.id
  cidr_block              = "10.20.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name          = "juracema-public-subnet"
    Project       = "Juracema-System"
    Environment   = "Portfolio"
    ProvisionedBy = "Terraform"
  }
}

resource "aws_internet_gateway" "juracema" {
  vpc_id = aws_vpc.juracema.id

  tags = {
    Name          = "juracema-igw"
    Project       = "Juracema-System"
    Environment   = "Portfolio"
    ProvisionedBy = "Terraform"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.juracema.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.juracema.id
  }
  tags = {
    Name          = "juracema-public-rt"
    Project       = "Juracema-System"
    Environment   = "Portfolio"
    ProvisionedBy = "Terraform"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}