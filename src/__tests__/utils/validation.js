import * as validator from "../../utils/validation";

describe("Testing email validator", () => {
  it("Should validate good email", () => {
    expect(validator.isValidEmail("dan@dan.com")).toEqual(true);
    expect(validator.isValidEmail("dan@sjsu.edu")).toEqual(true);
    expect(validator.isValidEmail("very.long.email@some.domain.edu")).toEqual(
      true
    );
  });
  it("Should find bad emails", () => {
    expect(validator.isValidEmail("notgood@email")).toEqual(false);
    expect(validator.isValidEmail("not.another.good@.com")).toEqual(false);
    expect(validator.isValidEmail("@email")).toEqual(false);
  });
});

describe("Testing password validator (Min 8 chars, 1 Num, 1 Symbol [#?!@$%^&*-], Upper/LowerCase)", () => {
  it("Should validate good password", () => {
    expect(validator.isValidPassword("abcABC1@")).toEqual(true);
    expect(validator.isValidPassword("1abbbbABB!")).toEqual(true);
    expect(validator.isValidPassword("!abcBABB@9")).toEqual(true);
  });
  it("Should find bad password", () => {
    expect(validator.isValidPassword("notgoodpassword")).toEqual(false);
    expect(validator.isValidPassword("anotherNotGood1either")).toEqual(false);
    expect(validator.isValidPassword("forgotnUmber$")).toEqual(false);
  });
});

describe("Testing valid name (0 < length <= Constant.MAX_NAME_LENGTH-50char", () => {
  it("Should validate good name", () => {
    expect(validator.isValidName("tooLongName")).toEqual(true);
    expect(validator.isValidName("danisagoodname")).toEqual(true);
    expect(validator.isValidName("mynameisoktoo")).toEqual(true);
  });
  it("Should find bad names", () => {
    const tooLongName = new Array(51).fill(1).join("");
    expect(validator.isValidName(tooLongName)).toEqual(false);
    expect(validator.isValidName("")).toEqual(false);
  });
});

describe("Testing valid date (>MIN_YEAR && <MAX_YEAR)", () => {
  it("Should find validate good date", () => {
    expect(validator.isValidDate("1950-1-1")).toEqual(true);
    expect(validator.isValidDate("1980-1-1")).toEqual(true);
    expect(validator.isValidDate("2003-1-1")).toEqual(true);
  });
  it("Should find bad dates", () => {
    expect(validator.isValidDate("1900-1-1")).toEqual(false);
    expect(
      validator.isValidDate(new Date(Date.now()).toLocaleDateString())
    ).toEqual(false);
  });
});

describe("Testing valid height (>MIN_HEIGHT && <MAX_HEIGHT)", () => {
  it("Should find validate good height", () => {
    expect(validator.isValidHeight(50)).toEqual(true);
    expect(validator.isValidHeight(60)).toEqual(true);
    expect(validator.isValidHeight(70)).toEqual(true);
  });
  it("Should find bad height", () => {
    expect(validator.isValidHeight(0)).toEqual(false);
    expect(validator.isValidHeight(100)).toEqual(false);
  });
});

describe("Testing valid weight (>MIN_WEIGHT && <MAX_WEIGHT)", () => {
  it("Should find validate good weight", () => {
    expect(validator.isValidWeight(120)).toEqual(true);
    expect(validator.isValidWeight(80)).toEqual(true);
    expect(validator.isValidWeight(200)).toEqual(true);
  });
  it("Should find bad weights", () => {
    expect(validator.isValidWeight(0)).toEqual(false);
    expect(validator.isValidWeight(500)).toEqual(false);
  });
});

describe("Testing has atleast MIN_PASSWORD_LENGTH characters in password", () => {
  it("Should find validate good password length ", () => {
    expect(validator.minChars("abacababab")).toEqual(true);
    expect(validator.minChars("iamavalidlength")).toEqual(true);
    expect(validator.minChars("iamalosavalidnelth")).toEqual(true);
  });
  it("Should find bad password lengths", () => {
    expect(validator.minChars("notlong")).toEqual(false);
    expect(validator.minChars("")).toEqual(false);
    expect(validator.minChars("abcabc")).toEqual(false);
  });
});

describe("Testing has atleast one number in password", () => {
  it("Should find validate good password ", () => {
    expect(validator.hasNumber("ihave1inme")).toEqual(true);
    expect(validator.hasNumber("11111111allones")).toEqual(true);
    expect(validator.hasNumber("1atbeginning")).toEqual(true);
    expect(validator.hasNumber("atendisok2")).toEqual(true);
  });
  it("Should find bad passwords", () => {
    expect(validator.hasNumber("oopsnonumber")).toEqual(false);
    expect(validator.hasNumber("")).toEqual(false);
    expect(validator.hasNumber("forgtanumbertooeventhoughloa")).toEqual(false);
  });
});

describe("Testing has atleast one lowercase in password", () => {
  it("Should find validate good password ", () => {
    expect(validator.hasLower("HAHAHAa")).toEqual(true);
    expect(validator.hasLower("aWORKSATBEGINING")).toEqual(true);
    expect(validator.hasLower("WORKSiNSIDE")).toEqual(true);
  });
  it("Should find bad passwords", () => {
    expect(validator.hasLower("OOPSNOLOWER")).toEqual(false);
    expect(validator.hasLower("")).toEqual(false);
    expect(validator.hasLower("1IFORGOTTOO!")).toEqual(false);
  });
});

describe("Testing has atleast one uppercase in password", () => {
  it("Should find validate good password ", () => {
    expect(validator.hasUpper("aaaH")).toEqual(true);
    expect(validator.hasUpper("Worksatbeginning")).toEqual(true);
    expect(validator.hasUpper("worksInside")).toEqual(true);
  });
  it("Should find bad passwords", () => {
    expect(validator.hasUpper("oopsnoupper")).toEqual(false);
    expect(validator.hasUpper("")).toEqual(false);
    expect(validator.hasUpper("1iforgottoo!")).toEqual(false);
  });
});

describe("Testing has atleast one symbol in password", () => {
  it("Should find validate good password ", () => {
    expect(validator.hasSymbol("aaa-")).toEqual(true);
    expect(validator.hasSymbol("!Worksatbeginning")).toEqual(true);
    expect(validator.hasSymbol("works#nside")).toEqual(true);
  });
  it("Should find bad passwords", () => {
    expect(validator.hasSymbol("oopsnouppersymbol")).toEqual(false);
    expect(validator.hasSymbol("")).toEqual(false);
    expect(validator.hasSymbol("iforgottoo")).toEqual(false);
  });
});

