import { compareSync, genSaltSync, hashSync } from "bcrypt";

export function HashedPassword(password)
{
    const salt=genSaltSync();
    return hashSync(password,salt);
}

export function ComparePasword(raw,hashedPassword){
    // console.log(raw);
    // console.log(hashedPassword);
    return compareSync(raw,hashedPassword)
}
