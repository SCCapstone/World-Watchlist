var expect = require("expect.js");
var $ = require("../../source/Ytility");

describe("Ytility", function() {
	describe("#capitalize", function() {
		it("should work properly", function() {
			expect($.capitalize("hello!")).to.be("Hello!");
			expect($.capitalize("HELLO!")).to.be("HELLO!");
		});
	});

	describe("#camelize", function() {
		it("should work properly", function() {
			expect($.camelize("Salut, ça va ?")).to.be("SalutÇaVa");
			expect($.camelize("SalutÇaVa")).to.be("SalutÇaVa");
			expect($.camelize("a b c d e f")).to.be("aBCDEF");
			expect($.camelize("(aaa,bbb,ccc,ddd,eee,fff)")).to.be("AaaBbbCccDddEeeFff");
		});
	});

	describe("#isDefined", function() {
		it("should work properly", function() {
			expect($.isDefined(undefined)).to.be(false);
			expect($.isDefined(null)).to.be(true);

			expect($.isDefined(false)).to.be(true);
			expect($.isDefined(true)).to.be(true);
			expect($.isDefined(Boolean(false))).to.be(true);
			expect($.isDefined(new Boolean(false))).to.be(true);
			expect($.isDefined(Boolean(true))).to.be(true);
			expect($.isDefined(new Boolean(true))).to.be(true);

			expect($.isDefined(NaN)).to.be(true);
			expect($.isDefined(123)).to.be(true);
			expect($.isDefined(Number(123))).to.be(true);
			expect($.isDefined(new Number(123))).to.be(true);

			expect($.isDefined("")).to.be(true);
			expect($.isDefined(String(""))).to.be(true);
			expect($.isDefined(new String(""))).to.be(true);

			expect($.isDefined({})).to.be(true);
			expect($.isDefined(Object())).to.be(true);
			expect($.isDefined(new Object())).to.be(true);

			expect($.isDefined([])).to.be(true);
			expect($.isDefined(Array())).to.be(true);
			expect($.isDefined(new Array())).to.be(true);

			expect($.isDefined(new Date())).to.be(true);

			expect($.isDefined(function() {})).to.be(true);
			expect($.isDefined(Function())).to.be(true);
			expect($.isDefined(new Function())).to.be(true);

			expect($.isDefined(/^$/)).to.be(true);
			expect($.isDefined(RegExp())).to.be(true);
			expect($.isDefined(new RegExp())).to.be(true);
		});
	});

	describe("#isObject", function() {
		it("should work properly", function() {
			expect($.isObject(undefined)).to.be(false);
			expect($.isObject(null)).to.be(false);

			expect($.isObject(false)).to.be(false);
			expect($.isObject(true)).to.be(false);
			expect($.isObject(Boolean(false))).to.be(false);
			expect($.isObject(new Boolean(false))).to.be(true);
			expect($.isObject(Boolean(true))).to.be(false);
			expect($.isObject(new Boolean(true))).to.be(true);

			expect($.isObject(NaN)).to.be(false);
			expect($.isObject(123)).to.be(false);
			expect($.isObject(Number(123))).to.be(false);
			expect($.isObject(new Number(123))).to.be(true);

			expect($.isObject("")).to.be(false);
			expect($.isObject(String(""))).to.be(false);
			expect($.isObject(new String(""))).to.be(true);

			expect($.isObject({})).to.be(true);
			expect($.isObject(Object())).to.be(true);
			expect($.isObject(new Object())).to.be(true);

			expect($.isObject([])).to.be(true);
			expect($.isObject(Array())).to.be(true);
			expect($.isObject(new Array())).to.be(true);

			expect($.isObject(Date())).to.be(false); // string
			expect($.isObject(new Date())).to.be(true);

			expect($.isObject(function() {})).to.be(true);
			expect($.isObject(Function())).to.be(true);
			expect($.isObject(new Function())).to.be(true);

			expect($.isObject(/^$/)).to.be(true);
			expect($.isObject(RegExp())).to.be(true);
			expect($.isObject(new RegExp())).to.be(true);
		});
	});
});