export class UpdatePasswordCollection {
    constructor(
        public password : string     = null,
        public confirmPassword: string     = null,
        public oldPassword : string = null,
    ){}
}
