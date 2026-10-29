(function ($) {
    "use strict";
    $(document).ready(function () {
        //show value 
        $(".wpcf7-checkbox_custom input, .wpcf7-radio_custom input").each(function (index) {
            var row_value = $(this).val();
            var n = row_value.search(/\|/i);
            if (n < 1) {
                var new_value = $(this).val();
                if (new_value == "") {
                    new_value = $(this).attr("value");
                }
                var text_lb = $(this).closest("span").find(".wpcf7-list-item-label").text();
                if (text_lb != "") {
                    $(this).val(new_value + "|" + text_lb);
                }
            }
        });
        $(".wpcf7-select_custom option1").each(function (index) {
            var row_value = $(this).val();
            var row_lable = $(this).html();
            var n = row_value.search(/\|/i);
            if (n < 1) {
                $(this).val(row_value + "|" + row_lable);
            }
        });
        $("body").on("click", "input.number-format", function () {
            $(this).autoNumeric();
            var data = $(this).autoNumeric("get");
            $(this).val(data);
        })
        $("body").on("change keyup", ".wpcf7 input,.wpcf7 select,.wpcf7 textarea", function (e) {
            $.cf7_formulas();
            if (typeof cf7_logic != 'undefined') {
                $("input").trigger("cf7_logic");
            }
        })
        $.cf7_formulas = function () {
            var total = 0;
            var max = 100;
            var reg = [];
            var match;
            $("form.wpcf7-form input").each(function () {
                if ($(this).attr("type") == "checkbox" || $(this).attr("type") == "radio") {
                    var name = $(this).attr("name");
                    if (name !== undefined) {
                        name = $(this).attr("name").replace("[]", "");
                        reg.push(name);
                    }
                } else {
                    var name = $(this).attr("name");
                    if (name !== undefined) {
                        name = $(this).attr("name").replace("[]", "");
                        reg.push(name);
                    }
                }
            })
            $("form.wpcf7-form select").each(function () {
                reg.push($(this).attr("name"));
            })
            $("form.wpcf7-form textarea").each(function () {
                reg.push($(this).attr("name"));
            })
            reg = $.remove_duplicates_ctf7(reg);
            var field_regexp = new RegExp('(' + reg.join("|") + ')');
            $(".ctf7-total").each(function (index) {
                var eq = $(this).data('formulas');
                var value_key_vl = false;
                if (eq == "") {
                    return;
                }
                eq = eq.toString();
                eq = eq.replace(/ /g, '');
                while (match = field_regexp.exec(eq)) {
                    var type = $("input[name=" + match[0] + "]").attr("type");
                    if (type === undefined) {
                        var type = $("input[name='" + match[0] + "[]']").attr("type");
                    }
                    if (type == "checkbox") {
                        var vl = 0;
                        $("input[name='" + match[0] + "[]']:checked").each(function () {
                            var row_value = $(this).val();
                            if (row_value == "") {
                                row_value = $(this).attr("value");
                            }
                            var n = row_value.search(/\|/i);
                            if (n > 0) {
                                var vls = row_value.split("|");
                                vl += new Number(vls[0]);
                            } else {
                                var new_value = $(this).val();
                                if (new_value == "") {
                                    new_value = $(this).attr("value");
                                }
                                vl += new Number(new_value);
                            }
                        });
                        $("input[name='" + match[0] + "']:checked").each(function () {
                            var row_value = $(this).val();
                            if (row_value == "") {
                                row_value = $(this).attr("value");
                            }
                            var n = row_value.search(/\|/i);
                            if (n > 0) {
                                var vls = row_value.split("|");
                                vl += new Number(vls[0]);
                            } else {
                                var new_value = $(this).val();
                                if (new_value == "") {
                                    new_value = $(this).attr("value");
                                }
                                vl += new Number(new_value);
                            }
                        });
                    } else if (type == "radio") {
                        var vl = $("input[name='" + match[0] + "']:checked").val();
                        if (vl == "") {
                            vl = $("input[name='" + match[0] + "']:checked").attr("value");
                        }
                        if (vl === undefined) {
                            vl = 0;
                        }
                        if (vl != 0) {
                            var n = vl.search(/\|/i);
                            if (n > 0) {
                                var vls = vl.split("|");
                                vl = new Number(vls[0]);
                            }
                        }
                    }
                    else if (type == "text") {
                        var vl = $("input[name=" + match[0] + "]").val();
                        if (vl == "") {
                            vl = $("input[name=" + match[0] + "]").attr("value");
                        }
                    } else if (type == "date") {
                        var vl = $("input[name=" + match[0] + "]").val();
                        if (vl == "") {
                            vl = $("input[name=" + match[0] + "]").attr("value");
                        }
                    }
                    else if (type === undefined) {
                        var type_textarea = $("textarea[name=" + match[0] + "]").val();
                        if (type_textarea === undefined) {
                            var vl = $("select[name=" + match[0] + "]").val();
                            var n = vl.search(/\|/i);
                            if (n > 0) {
                                var vls = vl.split("|");
                                vl = vls[0];
                            }
                        } else {
                            vl = type_textarea;
                        }
                    } else {
                        if ($("input[name=" + match[0] + "]").hasClass("ctf7-total")) {
                            var vl = $("input[name=" + match[0] + "]").attr("data-number");
                        } else {
                            var vl = $("input[name=" + match[0] + "]").val();
                            if (vl == "") {
                                vl = $("input[name=" + match[0] + "]").attr("value");
                            }
                        }
                    }
                    if ($("input[name=" + match[0] + "]").hasClass("number-format")) {
                        $("input[name=" + match[0] + "]").autoNumeric();
                        vl = $("input[name=" + match[0] + "]").autoNumeric("get");
                    } else {
                    }
                    if (vl == "") {
                        vl = 0;
                    }
                    var reg_inner = new RegExp(match[0] + "(?!\\d)", "gm");
                    eq = eq.replace(reg_inner, vl);
                }
                if (cf7_calculator.data == "ok") {
                    // Pre-process date and string functions
                    eq = $.cf7_fomulas_days(eq);
                    eq = $.cf7_fomulas_months(eq);
                    eq = $.cf7_fomulas_years(eq);
                    eq = $.cf7_fomulas_age(eq);
                    eq = $.cf7_fomulas_age_2(eq);
                    eq = $.cf7_fomulas_hours(eq);
                    eq = $.cf7_wordcount(eq);
                    eq = $.cf7_fomulas_variadic_transpile(eq, "max");
                    eq = $.cf7_fomulas_variadic_transpile(eq, "min");
                    eq = $.cf7_fomulas_variadic_transpile(eq, "sum");
                    eq = $.cf7_fomulas_variadic_transpile(eq, "avg");
                    eq = $.cf7_fomulas_switch(eq);
                    // Provide default 0 for rounddown missing argument
                    eq = eq.replace(/rounddown\(([^,]+)\)/g, 'rounddown($1,0)');
                    try {
                        const mexp = new Mexp;
                        mexp.addToken([
                            { token: "round", show: "round", type: 0, value: Math.round },
                            { token: "floor", show: "floor", type: 0, value: Math.floor },
                            { token: "ceil", show: "ceil", type: 0, value: Math.ceil },
                            { token: "sqrt", show: "sqrt", type: 0, value: Math.sqrt },
                            { token: "log10", show: "log10", type: 0, value: function (x) { return Math.log10(x); } },
                            { token: "round2", show: "round2", type: 0, value: function (x) { return parseFloat(parseFloat(x).toFixed(2)); } },
                            { token: "floor2", show: "floor2", type: 0, value: function (x) { return Math.floor(x * 100) / 100; } },
                            {
                                token: "custom", show: "custom", type: 0, value: function (x) {
                                    var sVal = x.toString();
                                    var values = sVal.split(".");
                                    var qk_c = parseInt(values[0] || 0);
                                    if (values.length > 1) {
                                        var qk_l = values[1].substring(0, 1);
                                        if (qk_l != "0") {
                                            if (parseInt(qk_l) < 6) qk_l = "5";
                                            else { qk_l = "0"; qk_c++; }
                                        }
                                        return parseFloat(qk_c + "." + qk_l);
                                    }
                                    return parseFloat(sVal);
                                }
                            },
                            { token: "mod", show: "mod", type: 8, value: function (a, b) { return a % b; }, numberOfArguments: 2 },
                            { token: "random", show: "random", type: 8, value: function (a, b) { return Math.floor(Math.random() * parseInt(b)) + parseInt(a); }, numberOfArguments: 2 },
                            {
                                token: "rounddown", show: "rounddown", type: 8, value: function (a, b) {
                                    const factor = Math.pow(10, b);
                                    return a >= 0 ? Math.floor(a * factor) / factor : Math.ceil(a * factor) / factor;
                                }, numberOfArguments: 2
                            },
                            { token: "rounded_multiple", show: "rounded_multiple", type: 8, value: function (a, b) { return Math.ceil(a / b) * b; }, numberOfArguments: 2 },
                            { token: "if", show: "if", type: 8, value: function (cond, t, f) { return cond > 0 ? t : f; }, numberOfArguments: 3 },
                            { token: "max", show: "max", type: 8, value: Math.max, numberOfArguments: 2 },
                            { token: "min", show: "min", type: 8, value: Math.min, numberOfArguments: 2 },
                            { token: "avg", show: "avg", type: 8, value: function (a, b) { return (a + b) / 2; }, numberOfArguments: 2 },
                            { token: "<=", show: "<=", type: 9, value: function (a, b) { return a <= b ? 1 : 0; } },
                            { token: ">=", show: ">=", type: 9, value: function (a, b) { return a >= b ? 1 : 0; } },
                            { token: "==", show: "==", type: 9, value: function (a, b) { return a == b ? 1 : 0; } },
                            { token: "!=", show: "!=", type: 9, value: function (a, b) { return a != b ? 1 : 0; } },
                            { token: "<", show: "<", type: 9, value: function (a, b) { return a < b ? 1 : 0; } },
                            { token: ">", show: ">", type: 9, value: function (a, b) { return a > b ? 1 : 0; } }
                        ]);
                        // Fix precedence of logic operators to ensure they evaluate AFTER arithmetic
                        mexp.tokens.forEach(t => {
                            if (['<', '>', '<=', '>=', '==', '!='].includes(t.token)) {
                                t.precedence = 0.5;
                            }
                        });
                        var r = mexp.eval(eq); // Evaluate the final equation
                        total = r;
                    }
                    catch (e) {
                        console.error("MEXP Error:", e);
                        total = eq;
                    }
                } else {
                    try {
                        var r = eval(eq);
                        total = r;
                    }
                    catch (e) {
                        total = eq + " Upgrade to pro version";
                    }
                }
                $(this).attr("data-number", total);
                if ($(this).hasClass("number-format")) {
                    $(this).autoNumeric();
                    $(this).autoNumeric("set", total);
                    $(this).parent().find('.cf7-calculated-name').autoNumeric();
                    $(this).parent().find('.cf7-calculated-name').autoNumeric("set", total);
                } else {
                    $(this).attr("value", total);
                    $(this).val(total);
                    $(this).parent().find('.cf7-calculated-name').html(total);
                }
            });
        }
        $.remove_duplicates_ctf7 = function (arr) {
            var obj = {};
            var ret_arr = [];
            for (var i = 0; i < arr.length; i++) {
                obj[arr[i]] = true;
            }
            for (var key in obj) {
                if ("_wpcf7" == key || "_wpcf7_version" == key || "_wpcf7_locale" == key || "_wpcf7_unit_tag" == key || "_wpnonce" == key || "undefined" == key || "_wpcf7_container_post" == key || "_wpcf7_nonce" == key) {
                } else {
                    if (key != "") {
                        ret_arr.push(key + "(?!\\d)");
                    }
                }
            }
            return ret_arr;
        }
        $.cf7_split_args = function (str) {
            var args = [];
            var current = "";
            var depth = 0;
            for (var i = 0; i < str.length; i++) {
                var char = str[i];
                if (char === "," && depth === 0) {
                    args.push(current);
                    current = "";
                } else {
                    if (char === "(") depth++;
                    if (char === ")") depth--;
                    current += char;
                }
            }
            args.push(current);
            return args;
        };
        $.cf7_fomulas_age = function (x) {
            var re = /age\(([^()]*)\)/gm;
            x = x.replace(re, function (match, content) {
                var dob = new Date(content.trim());
                var today = new Date();
                return Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
            });
            if (x.match(re)) {
                x = $.cf7_fomulas_age(x);
            }
            return x;
        }
        function yeekit_cf7_fomulas_rounddown(number, num_digits = 0) {
            const factor = Math.pow(10, num_digits);
            return number >= 0
                ? Math.floor(number * factor) / factor
                : Math.ceil(number * factor) / factor;
        }
        $.cf7_fomulas_age_2 = function (x) {
            var re = /age2\(([^()]*)\)/gm;
            x = x.replace(re, function (match, content) {
                var datas = content.split(",");
                var dob = new Date(datas[0].trim());
                var today = new Date(datas[1].trim());
                return Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
            });
            if (x.match(re)) {
                x = $.cf7_fomulas_age_2(x);
            }
            return x;
        }
        $.cf7_fomulas_days = function (x) {
            var re = /days\(([^()]*)\)/gm;
            x = x.replace(re, function (match, content) {
                var datas = content.split(",");
                var day_end1, day_start1;
                if (datas[1].trim() == "now") {
                    var today = new Date();
                    day_end1 = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                } else {
                    day_end1 = datas[1].trim();
                }
                if (datas[0].trim() == "now") {
                    var today = new Date();
                    day_start1 = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                } else {
                    day_start1 = datas[0].trim();
                }
                var day_end = $.cf7_fomulas_parse_date(day_end1);
                var day_start = $.cf7_fomulas_parse_date(day_start1);
                if (isNaN(day_end) || isNaN(day_start)) {
                    return 0;
                } else {
                    return $.cf7_fomulas_datediff(day_end, day_start);
                }
            });
            if (x.match(re)) {
                x = $.cf7_fomulas_days(x);
            }
            return x;
        }
        $.cf7_fomulas_months = function (x) {
            var re = /months\(([^()]*)\)/gm;
            x = x.replace(re, function (match, content) {
                var datas = content.split(",");
                var day_end1, day_start1;
                if (datas[1].trim() == "now") {
                    var today = new Date();
                    day_end1 = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                } else {
                    day_end1 = datas[1].trim();
                }
                var day_end = $.cf7_fomulas_parse_date(day_end1);
                if (datas[0].trim() == "now") {
                    var today = new Date();
                    day_start1 = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                } else {
                    day_start1 = datas[0].trim();
                }
                var day_start = $.cf7_fomulas_parse_date(day_start1);
                if (isNaN(day_end) || isNaN(day_start)) {
                    return 0;
                } else {
                    return day_start.getMonth() - day_end.getMonth() + (12 * (day_start.getFullYear() - day_end.getFullYear()))
                }
            });
            if (x.match(re)) {
                x = $.cf7_fomulas_months(x);
            }
            return x;
        }
        $.cf7_fomulas_years = function (x) {
            var re = /years\(([^()]*)\)/gm;
            x = x.replace(re, function (match, content) {
                var datas = content.split(",");
                var day_end1, day_start1;
                if (datas[1].trim() == "now") {
                    var today = new Date();
                    day_end1 = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                } else {
                    day_end1 = datas[1].trim();
                }
                var day_end = $.cf7_fomulas_parse_date(day_end1);
                if (datas[0].trim() == "now") {
                    var today = new Date();
                    day_start1 = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                } else {
                    day_start1 = datas[0].trim();
                }
                var day_start = $.cf7_fomulas_parse_date(day_start1);
                if (isNaN(day_end) || isNaN(day_start)) {
                    return 0;
                } else {
                    return day_start.getFullYear() - day_end.getFullYear();
                }
            });
            if (x.match(re)) {
                x = $.cf7_fomulas_years(x);
            }
            return x;
        }
        $.cf7_fomulas_variadic_transpile = function (eq, funcName) {
            var tokenStr = funcName + "(";
            if (typeof eq !== "string" || eq.indexOf(tokenStr) === -1) return eq;

            var result = "";
            var i = 0;
            while (i < eq.length) {
                var idx = eq.indexOf(tokenStr, i);
                if (idx === -1) {
                    result += eq.substring(i);
                    break;
                }

                if (idx > 0 && /[a-zA-Z0-9_]/.test(eq[idx - 1])) {
                    result += eq.substring(i, idx + tokenStr.length);
                    i = idx + tokenStr.length;
                    continue;
                }

                result += eq.substring(i, idx);
                var depth = 0;
                var start = idx + tokenStr.length;
                var j = start;
                while (j < eq.length) {
                    if (eq[j] === '(') depth++;
                    else if (eq[j] === ')') {
                        if (depth === 0) break;
                        depth--;
                    }
                    j++;
                }
                if (j === eq.length) {
                    result += eq.substring(idx);
                    break;
                }
                var innerArgs = eq.substring(start, j);
                var argsStrList = $.cf7_split_args(innerArgs);
                var validArgs = [];
                for (var argIdx = 0; argIdx < argsStrList.length; argIdx++) {
                    var trimmed = argsStrList[argIdx].trim();
                    if (trimmed !== "") {
                        validArgs.push($.cf7_fomulas_variadic_transpile(trimmed, funcName));
                    }
                }

                var transformed = "";
                if (funcName === "max" || funcName === "min") {
                    if (validArgs.length === 0) {
                        transformed = "0";
                    } else if (validArgs.length === 1) {
                        transformed = validArgs[0];
                    } else {
                        transformed = validArgs[validArgs.length - 1];
                        for (var k = validArgs.length - 2; k >= 0; k--) {
                            transformed = funcName + "(" + validArgs[k] + "," + transformed + ")";
                        }
                    }
                } else if (funcName === "sum") {
                    if (validArgs.length === 0) {
                        transformed = "0";
                    } else {
                        transformed = "((" + validArgs.join(")+(") + "))";
                    }
                } else if (funcName === "avg") {
                    if (validArgs.length === 0) {
                        transformed = "0";
                    } else {
                        transformed = "(((" + validArgs.join(")+(") + "))/" + validArgs.length + ")";
                    }
                }

                result += transformed;
                i = j + 1;
            }
            return result;
        };
        $.cf7_wordcount = function (x) {
            var re = /wordcount\(([^()]*)\)/gm;
            x = x.replace(re, function (match, content) {
                return content.trim().split(/\s+/).length;
            });
            if (x.match(re)) {
                x = $.cf7_wordcount(x);
            }
            return x;
        }
        $.cf7_fomulas_switch = function (eq) {
            if (typeof eq !== "string" || eq.indexOf("switch(") === -1) return eq;

            var result = "";
            var i = 0;
            while (i < eq.length) {
                var idx = eq.indexOf("switch(", i);
                if (idx === -1) {
                    result += eq.substring(i);
                    break;
                }
                result += eq.substring(i, idx);
                var depth = 0;
                var start = idx + 7;
                var j = start;
                while (j < eq.length) {
                    if (eq[j] === '(') depth++;
                    else if (eq[j] === ')') {
                        if (depth === 0) break;
                        depth--;
                    }
                    j++;
                }
                if (j === eq.length) {
                    result += eq.substring(idx);
                    break;
                }
                var innerArgs = eq.substring(start, j);
                var args = $.cf7_split_args(innerArgs);

                var target = args[0] ? args[0].trim() : "0";
                var defaultVal = "0";

                if (args.length % 2 === 0) {
                    defaultVal = args[args.length - 1].trim();
                }

                var transformed = defaultVal;
                var limit = args.length % 2 === 0 ? args.length - 2 : args.length - 1;

                for (var k = limit - 1; k >= 1; k -= 2) {
                    var c = args[k].trim();
                    var v = args[k + 1].trim();
                    transformed = "if(" + target + "==" + c + "," + v + "," + transformed + ")";
                }

                result += $.cf7_fomulas_switch(transformed);
                i = j + 1;
            }
            return result;
        };
        $.cf7_fomulas_hours = function (x) {
            var re = /hours\(([^()]*)\)/gm;
            x = x.replace(re, function (match, content) {
                var datas = content.split(",");
                var hour_start = datas[1].trim();
                var hour_end = datas[0].trim();
                var hour_start_m = hour_start.split(":");
                var hour_end_m = hour_end.split(":");
                var h_start_h = parseInt(hour_start_m[0]);
                var h_end_h = parseInt(hour_end_m[0]);
                if (h_start_h >= 22 && h_end_h <= 7) {
                    return -1;
                } else {
                    return $.cf7_fomulas_hoursiff(hour_start, hour_end);
                }
            });
            if (x.match(re)) {
                x = $.cf7_fomulas_hours(x);
            }
            return x;
        }
        $.cf7_fomulas_parse_date = function (str) {
            return new Date(str);
        }
        $.cf7_cover_date_format = function (str, id) {
            var date = "";
            var format = id.data("date-format");
            if (format == "m/d/Y") {
                var datas = str.split("/");
                date = datas[2] + "-" + datas[0] + "-" + datas[1];
            } else if (format == "d/m/Y") {
                var datas = str.split("/");
                date = datas[2] + "-" + datas[1] + "-" + datas[0];
            } else if (format == "F j, Y") {
                date = str;
            }
            return date;
        }
        $.cf7_fomulas_datediff = function (first, second) {
            second = second.getTime();
            first = first.getTime();
            return Math.round((second - first) / (1000 * 60 * 60 * 24));
        }
        if ($(".wpcf7-form").length) {
            $.cf7_formulas();
            $(".cf7-hide").closest('p').css('display', 'none');
        }
    })
})(jQuery);