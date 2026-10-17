{
  description = "Pinned clean-room ARM build tools";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";

  outputs = { nixpkgs, ... }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      packages.${system} = {
        toolchain = pkgs.gcc-arm-embedded;
        binutils = pkgs.lib.getBin pkgs.pkgsCross.arm-embedded.buildPackages.binutils;
        ghidra = pkgs.ghidra;
      };
    };
}
