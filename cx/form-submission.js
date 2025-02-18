const countryToContinent = {
  AL: "Europe",
  AD: "Europe",
  AT: "Europe",
  BY: "Europe",
  BE: "Europe",
  BA: "Europe",
  BG: "Europe",
  HR: "Europe",
  CY: "Europe",
  CZ: "Europe",
  DK: "Europe",
  EE: "Europe",
  FI: "Europe",
  FR: "Europe",
  DE: "Europe",
  GR: "Europe",
  HU: "Europe",
  IS: "Europe",
  IE: "Europe",
  IT: "Europe",
  XK: "Europe",
  LV: "Europe",
  LI: "Europe",
  LT: "Europe",
  LU: "Europe",
  MT: "Europe",
  MD: "Europe",
  MC: "Europe",
  ME: "Europe",
  NL: "Europe",
  MK: "Europe",
  NO: "Europe",
  PL: "Europe",
  PT: "Europe",
  RO: "Europe",
  RU: "Europe",
  SM: "Europe",
  RS: "Europe",
  SK: "Europe",
  SI: "Europe",
  ES: "Europe",
  SE: "Europe",
  CH: "Europe",
  UA: "Europe",
  GB: "Europe",
  VA: "Europe",
  CA: "America",
  US: "America",
  MX: "America",
  GT: "America",
  BZ: "America",
  SV: "America",
  HN: "America",
  NI: "America",
  CR: "America",
  PA: "America",
  CU: "America",
  HT: "America",
  DO: "America",
  JM: "America",
  TT: "America",
  BB: "America",
  LC: "America",
  VC: "America",
  AG: "America",
  DM: "America",
  GD: "America",
  BS: "America",
  KN: "America",
  AR: "America",
  BO: "America",
  BR: "America",
  CL: "America",
  CO: "America",
  EC: "America",
  GY: "America",
  PY: "America",
  PE: "America",
  SR: "America",
  UY: "America",
  VE: "America",
};

function getIp(callback) {
  try {
    if (sessionStorage.getItem("ipData")) {
      let ipData = JSON.parse(sessionStorage.getItem("ipData"));

      callback(ipData.ipLocationCountry, ipData.ipAddr);
    } else {
      // $.get('https://ipinfo.io/json?token=ef07e0b338b1e0', function() {}, "jsonp").always(function(resp) {
      $.get("https://ipinfo.io/json?token=1aff17b3d558ec", function () {}, "jsonp").always(function (resp) {
        ipLocationCountry = resp && resp.country ? resp.country : "US";
        ipAddr = resp && resp.ip ? resp.ip : "Not known";

        // setCookie('ipData',{ipLocationCountry, ipAddr },1)
        let ipData = { ipLocationCountry, ipAddr };
        sessionStorage.setItem("ipData", JSON.stringify(ipData));
        callback(ipLocationCountry, ipAddr);
      });
    }
  } catch (e) {
    $.get("https://ipinfo.io/json?token=1aff17b3d558ec", function () {}, "jsonp").always(function (resp) {
      ipLocationCountry = resp && resp.country ? resp.country : "US";
      ipAddr = resp && resp.ip ? resp.ip : "Not known";
      // setCookie('ipData',{ipLocationCountry, ipAddr },1)
      let ipData = { ipLocationCountry, ipAddr };
      callback(ipLocationCountry, ipAddr);
    });
  }
}
getIp(function (code, ip) {
  $("input[name='phone_number']").each(function () {
    $($(this)[0]).parents("form").find("input[name='ip_country']").val(code);
    $($(this)[0]).parents("form").find("input[name='ip_address']").val(ip);
    $("#isTwoLevel").val(null);
  });
});

function runIntlTelInput(element, countryCallback) {
  // Create, initiate and return  intlTelInput object
  let iti = window.intlTelInput(element, {
    initialCountry: "auto",
    preferredCountries: ["us", "gb", "ca", "fr", "au"],
    separateDialCode: true,
    autoPlaceholder: "aggressive",
    allowDropdown: true,
    nationalMode: false,
    customPlaceholder: function (selectedCountryPlaceholder, selectedCountryData) {
      setTimeout(() => {
        let pattern = $(element)
          .attr("placeholder")
          .replace(/[0-9]/g, "9")
          .replace(/([9]\d{0,10})/g, "{{$1}}");
        $(element).formatter({
          pattern: pattern,
        });
        $(element).formatter().resetPattern(pattern);
      }, 500);
      return selectedCountryPlaceholder.replace(new RegExp("[0-9]", "g"), "8");
    },
    formatOnDisplay: true,
    geoIpLookup: getIp,
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
  });
  return iti;
}

function validatePhoneNumber(element, iti, phoneCode) {
  let $currentInput = $(element);
  var formatedNumber = intlTelInputUtils.formatNumber($(phoneCode).val() + $(element).val(), null, 1);
  formatedNumber = formatedNumber.replace($(phoneCode).val(), "").trim();

  if (!iti.isValidNumber()) {
    $currentInput.parents("form").find(".form-error-block.mobile-number").text("Invalid mobile number");
    $currentInput.parents("form").find(".form-error-block.mobile-number").show();
    setTimeout(function () {
      $currentInput.parents("form").find(".form-error-block.mobile-number").hide();
    }, 2000);
    return false;
  } else {
    return true;
  }
}

function oneCheckboxIsFilled(whatsNeed1, whatsNeed2, formItem) {
  if (formItem.classList.contains("ebook-form")) {
    return true;
  } else if ($(whatsNeed1).prop("checked") || $(whatsNeed2).prop("checked")) {
    //console.log($(whatsNeed1).prop("checked") + " ....." + $(whatsNeed2).prop("checked"));
    return true;
  } else {
    return false;
  }
}

async function checkInHubspot(email) {
  const checkEndPoint = "https://contacto-hubspot-master.netlify.app/.netlify/functions/checkinhubspot";
  var email = $(email).val();

  return fetch(checkEndPoint, {
    method: "post",
    body: $.param({
      email: email,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((e) => {
      console.log(e);
      return { error: "Error" };
    });
}

async function validateEmail(email) {
  // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
  //   return true;
  // }

  // return false;
  //console.log($(email).val());
  const submitEndPoint = "http://localhost:8888/.netlify/functions/email-validation";
  let email_add = $(email).val();

  let $currentInput = $(email);

  // Store reference to $(this)
  await fetch(submitEndPoint, {
    method: "post",
    body: $.param({
      email: email_add,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === "Invalid Email") {
        $currentInput.parents("form").find(".form-error-block.work-email").text("Please enter a valid email.");
        $currentInput.parents("form").find(".form-error-block.work-email").show();
        // console.log("a");
        setTimeout(function () {
          $currentInput.parents("form").find(".form-error-block.work-email").hide();
        }, 2000);
        return false;
      } else if (data.status === "Personal Email") {
        $currentInput.parents("form").find(".form-error-block.work-email").text("Please enter a company email.");
        $currentInput.parents("form").find(".form-error-block.work-email").show();
        //console.log("ab");
        setTimeout(function () {
          $currentInput.parents("form").find(".form-error-block.work-email").hide();
        }, 2000);
        return false;
      } else if (data.status === "Blacklisted Email") {
        $currentInput.parents("form").find(".form-error-block.work-email").text("Please try a different email domain.");
        $currentInput.parents("form").find(".form-error-block.work-email").show();
        //console.log("abc");
        setTimeout(function () {
          $currentInput.parents("form").find(".form-error-block.work-email").hide();
        }, 2000);
        return false;
      } else {
        // console.log("fg");
        return true;
        // Other actions for valid email
      }
    })
    .catch((e) => {
      $currentInput.parents("form").find(".form-error-block.work-email").text("Please try again.");
      $currentInput.parents("form").find(".form-error-block.work-email").show();
      // console.log("abc")
      setTimeout(function () {
        $currentInput.parents("form").find(".form-error-block.work-email").hide();
      }, 2000);

      //console.log(e);
      return false;
    });
}
function splitName(fullName) {
  let nameParts = String(fullName).split(" ");

  if (nameParts.length === 1) {
    return {
      firstName: nameParts[0],
      lastName: "",
    };
  } else if (nameParts.length === 2) {
    return {
      firstName: nameParts[0],
      lastName: nameParts[1],
    };
  } else {
    let firstName = nameParts[0];
    // Remove the first name from the name parts
    nameParts.shift();
    let lastName = nameParts.join(" ");
    return {
      firstName,
      lastName,
    };
  }
}

function isValidWebsite(url) {
  const websiteRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+)\.[a-zA-Z]{2,}(\/\S*)?$/;
  return websiteRegex.test(url);
}

function setEventListenersPhone(element, iti, phoneCode, phoneCountry, formItem) {
  // On country change change the value of phone_country and phone_code fields according to the selected country
  let fullName = formItem.elements["full_name"];
  let phoneNumber = formItem.elements["phone_number"];
  let website = formItem.elements["website"];
  //console.log($(phoneNumber));
  //console.log($(fullName));
  //let firstName =  splitName(fullName).firstName;
  //let lastName = splitName(fullName).lastName;

  $(phoneCountry).val("US");
  $(element).on("countrychange", function (e, countryData) {
    setPhoneCode(element, iti, phoneCode, phoneCountry);
  });

  $(element).on("input", function () {
    var c = this.selectionStart,
      r = /[^0-9]/gi,
      v = $(this).val();
    if (r.test(v)) {
      $(this).val(v.replace(r, ""));
      c--;
    }
    this.setSelectionRange(c, c);
  });

  $(fullName).keypress(function (e) {
    e = e || window.event;
    var charCode = typeof e.which == "undefined" ? e.keyCode : e.which;
    var charStr = String.fromCharCode(charCode);
    if (!/^[a-zA-Z\s]$/.test(charStr)) {
      return false;
    }
  });

  $(phoneNumber).on("focusout", function (e) {
    if ($(this).val()) {
      validatePhoneNumber(phoneNumber, iti, phoneCode);
    }
  });

  $(fullName).focusout(function () {
    if ($(fullName).val() != "") {
      if (!/\w\w+/.test($(fullName).val())) {
        let $currentInput = $(this);
        $currentInput.parents("form").find(".form-error-block.full-name").text("Invalid full name");
        $currentInput.parents("form").find(".form-error-block.full-name").show();
        setTimeout(function () {
          $currentInput.parents("form").find(".form-error-block.full-name").hide();
        }, 2000);
      }
    }
  });

  $(website).focusout(function () {
    if ($(website).val() != "") {
      if (!isValidWebsite($(website).val())) {
        let $currentInput = $(this);
        $currentInput.parents("form").find(".form-error-block.website").text("Invalid website link");
        $currentInput.parents("form").find(".form-error-block.website").show();
        setTimeout(function () {
          $currentInput.parents("form").find(".form-error-block.website").hide();
        }, 2000);
      }
    }
  });

  // //Validate Email turned off on 2 aug
  // $("input[name='company_email']").each(function (i, email) {
  //   $(email).focusout(function () {
  //     validateEmail(email);
  //   });
  // });
  //add this in final if else -
  // else if (!validateEmail(companyEmail)) {
  //             $(this).find('[type="submit"]').toggleClass("loading");
  //           }
}

function setPhoneCode(element, iti, phoneCode, phoneCountry) {
  countryData = iti.getSelectedCountryData();
  $(phoneCode).val(countryData.dialCode || "1");
  let iso = countryData.iso2;
  $(phoneCountry).val(iso.toUpperCase());
}

$(document).ready(function () {
  $.fn.getCookie = function (name) {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return value != null ? unescape(value[1]) : null;
  };
  var queryString = window.location.search; //.slice(1).split('&');
  $.fn.queryStringToJson = function (querystring, name) {
    if (querystring) {
      return (/^[?#]/.test(querystring) ? querystring.slice(1) : querystring).split("&").reduce((params, param) => {
        let [key, value] = param.split("=");
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
        return params;
      }, {});
    }
  };

  var queryJson = $.fn.queryStringToJson(queryString);

  campaignFirstCookie = $.fn.getCookie("campaign_first");
  campaignLatestCookie = $.fn.getCookie("campaing_latest");

  campaignFirstCookie_json = JSON.parse(campaignFirstCookie);
  campaignLatestCookie_json = JSON.parse(campaignLatestCookie);
  //   console.log(  $.fn.getCookie("hubspotutk"));
});
(function () {
  "use strict";
  $(document).ready(function () {
    var forms = document.querySelectorAll(".contacto-web-form");
    let captchaCount = 0;

    const submitButtons = $(".g-recaptcha").next();
    // submitButtons.each(function(idx,button){
    //   button.addEventListener('click',function(e){
    //     e.preventDefault();
    // 		e.stopPropagation();
    //   //  console.log($(event.target).prev().data("widget-id"));
    //     let widgetId = Number($(event.target).prev().data("widget-id"));
    //    // console.log(widgetId);
    //     grecaptcha.execute(widgetId);
    //    })
    //  })

    forms.forEach(function (formItem) {
      let hubSpot = formItem.dataset.hubspot;

      let fullName = formItem.elements["full_name"];
      let companyEmail = formItem.elements["company_email"];
      let phoneCode = formItem.elements["phone_code"];
      let phoneNumber = formItem.elements["phone_number"];
      let phoneCountry = formItem.elements["phone_country"];
      let whatsNeed1 = formItem.elements["what_s_your_need__1"];
      let whatsNeed2 = formItem.elements["what_s_your_need__2"];
      let websiteLink = formItem.elements["website"];

      let iti;

      if (phoneNumber !== undefined) {
        console.log("hey1");
        iti = runIntlTelInput($(phoneNumber)[0]);
        setEventListenersPhone($(phoneNumber)[0], iti, phoneCode, phoneCountry, formItem);
      }

      formItem.addEventListener(
        "submit",
        async function (event) {
          event.preventDefault();
          event.stopPropagation();
          $(this).find('[type="submit"]').toggleClass("loading");
          // const submitEndPoint = 'https://contacto-hubspot-master.netlify.app/.netlify/functions/hubspotsubmition3';
          //const submitEndPoint = "https://contacto-hubspot-master.netlify.app/.netlify/functions/hubspotsubmition2";
          const submitEndPoint = "http://localhost:8888/.netlify/functions/hubspotsubmition-novalidation";
          //const submitEndPoint = "http://localhost:8888/.netlify/functions/hubspotsubmition2";
          const valid = formItem.checkValidity();
          let userCountryCode = $(phoneCountry).val().toUpperCase();
          let calendlyFname = $(fullName)?.val() || "";
          let calendlyEmail = $(companyEmail)?.val() || "";
          //load calendly now, but hide it and show it later

          var pathname = window.location.pathname.replace(/\/+$/, "");
          var arani = false;
          var vyas = false;

          if (pathname === "/cx") {
            if ($(whatsNeed2).prop("checked")) {
              vyas = true;
            } else {
              arani = true;
            }
          } else if (pathname.startsWith("/cx/service")) {
            arani = true;
          } else if (
            (pathname.startsWith("/cx/engage") && countryToContinent[userCountryCode.toUpperCase()] !== undefined) ||
            countryToContinent[userCountryCode.toUpperCase()] !== undefined
          ) {
            vyas = true;
          }

          if (arani) {
            // Calendly.initInlineWidget({
            //   url: "https://calendly.com/arani-bhowmick/30min",
            //   parentElement: $(this).parent(".form-block.w-form").siblings(".calendly-wrapper"),
            //   prefill: {
            //     name: calendlyFname,
            //     email: calendlyEmail,
            //   },
            //   utm: {},
            // });
            Cal.ns["30min"]("inline", {
              elementOrSelector: ".calendly-wrapper",
              config: { layout: "month_view" },
              calLink: "plivoai/30min",
            });

            Cal.ns["30min"]("ui", { hideEventTypeDetails: false, layout: "month_view" });
          } else if (vyas) {
            Calendly.initInlineWidget({
              url: "https://calendly.com/ramya-plivo/15min",
              parentElement: $(this).parent(".form-block.w-form").siblings(".calendly-wrapper"),
              prefill: {
                name: calendlyFname,
                email: calendlyEmail,
              },
              utm: {},
            });
          }

          if (
            valid &&
            /\w\w+/.test($(fullName).val()) &&
            isValidWebsite($(websiteLink).val()) &&
            //validateEmail(companyEmail) &&
            validatePhoneNumber(phoneNumber, iti, phoneCode) &&
            oneCheckboxIsFilled(whatsNeed1, whatsNeed2, formItem)
          ) {
            if (phoneNumber !== undefined) {
              if ($(phoneNumber).length) {
                $(phoneNumber).val($(phoneNumber).val().replace(/[\s-]/g, ""));
              }
            }

            campaignFirstCookie = $.fn.getCookie("campaign_first");
            campaignLatestCookie = $.fn.getCookie("campaign_latest");
            campaignFirstCookie_json = JSON.parse(campaignFirstCookie);
            $(this).find("#last_visited").val($.fn.getCookie("last_visited"));
            $(this).find("#pardot_visitor_id").val($.fn.getCookie("visitor_id873501"));

            var inHubspot = await checkInHubspot(companyEmail);
            //console.log(inHubspot);
            validateEmail(companyEmail);

            $.each($.parseJSON(campaignFirstCookie), function (element, value) {
              if (element != "") {
                $("#" + element, formItem).val(value);
                if (element === "landing_page") {
                  // Handle the special case for landing_page
                  inHubspot.total === 0
                    ? $("#initial_utm_landing_page", formItem).val(value)
                    : $("#latest_utm_landing_page", formItem).val(value);
                } else {
                  // Handle all other cases
                  inHubspot.total === 0
                    ? $("#initial_" + element, formItem).val(value)
                    : $("#latest_" + element, formItem).val(value);
                }
              }
            });

            $.each($.parseJSON(campaignLatestCookie), function (element, value) {
              if (element != "") {
                $("#" + element + "_2", formItem).val(value);
                if (element === "landing_page") {
                  $("#latest_utm_landing_page", formItem).val(value);
                } else {
                  $("#latest_" + element, formItem).val(value);
                }
              }
            });

            if (phoneNumber !== undefined) {
              setPhoneCode($(phoneNumber)[0], iti, phoneCode, phoneCountry);
            }

            if (formItem.elements["full_name"] !== undefined) {
              let fName = $(fullName).val();
              formItem.elements["first_name"].value = splitName(fName).firstName;
              formItem.elements["last_name"].value = splitName(fName).lastName;
            }

            var tempFormData = $(formItem).serialize();

            fetch(submitEndPoint, {
              method: "post",
              body: $.param({ formData: tempFormData, hubSpot: hubSpot, hubspotutk: $.fn.getCookie("hubspotutk") }),
            })
              .then((res) => {
                return res.json();
              })
              .then((resp) => {
                console.log(resp);
                if (event.target.id == "contact-form") {
                  dataLayer.push({ event: "Video_selfguide_trigger" });
                } else {
                  dataLayer.push({ event: "form_trigger" });
                }

                if (resp.status === "Submitted") {
                  if (
                    !formItem.classList.contains("ebook-form") &&
                    !formItem.classList.contains("calendar-download") &&
                    (arani || vyas)
                  ) {
                    //countryToContinent[userCountryCode.toUpperCase()] !== undefined

                    $(this).parent(".form-block.w-form").hide();
                    $(this).parent(".form-block.w-form").siblings(".calendly-wrapper").show();

                    //this code is commented out because we no longer check for valid companies to get more leads

                    // ************************ Calendly Code ********************************* //
                    //enrichment to check company details
                    // fetch(
                    //   `https://contacto-hubspot-master.netlify.app/.netlify/functions/enrich?email=${calendlyEmail}`,
                    //   {
                    //     method: "get",
                    //   }
                    // )
                    //   .then((response) => response.json())
                    //   .then((data) => {
                    //     $(this).parent(".form-block.w-form").hide();
                    //     /************* make sure to have a div with id #calendly in order to display Calendly **************/
                    //     $(this).parent(".form-block.w-form").siblings(".calendly-wrapper").show(),
                    //       Calendly.initInlineWidget({
                    //         url: "https://calendly.com/anvyas/15min",
                    //         parentElement: $(this).parent(".form-block.w-form").siblings(".calendly-wrapper"),
                    //         prefill: {
                    //           name: calendlyFname,
                    //           email: calendlyEmail,
                    //         },
                    //         utm: {},
                    //       });
                    //     //console.log(data.company.risk_profile);
                    //     //console.log(data.company.segment);
                    //   })
                    //   .catch((e) => {
                    //     console.log(e);
                    //   });

                    // ************************ Calendly Code end ********************************* //
                  } else {
                    $(this).css("display", "none");
                    if (formItem.classList.contains("calendar-download")) {
                      window.open(
                        "https://cdn.prod.website-files.com/64a6a2de2958e7393752dc70/670d146556a58e6c44394650_Ecommerce%20Marketing%20Calendar%202024.pdf",
                        "_blank"
                      );
                      $(".sm-p").text("Thank you for downloading.");
                      $(".success-message_form").css("width", "100%");
                      $(".sm-title").css("display", "none");
                    }
                    if (formItem.classList.contains("ebook-form")) {
                      $(".sm-p").text("Thank you.");
                      $(".success-message_form").css("width", "100%");
                      $(".sm-title").css("display", "none");
                    }
                    $(this).siblings(".success-message").css("display", "flex");
                  }

                  //posthog
                  posthog.identify($.fn.getCookie("hubspotutk"), {
                    email: calendlyEmail,
                    name: calendlyFname,
                    phone_number: $(phoneNumber)?.val() || "",
                    website: $(websiteLink)?.val() || "",
                  });
                  $(this).find('[type="submit"]').toggleClass("loading");

                  const ev = new CustomEvent("form-success", { detail: "{{include.uniqueId}}" });
                  formItem.dispatchEvent(ev);
                } else {
                  //console.log(resp);
                  //handleEmailError($('[type="email"]', formItem));
                  // let widgetId = Number($(".g-recaptcha", formItem).data("widget-id"));
                  //grecaptcha.reset(widgetId);
                  // $(this).find(".form-error-block.main-err").text("Please try again.");
                  // $(this).find(".form-error-block.main-err").show();
                  // var x = $(this);
                  // setTimeout(function () {
                  //   $(x).find(".form-error-block.main-err").hide();
                  // }, 2000);
                  $(this).find('[type="submit"]').toggleClass("loading");
                }
              })
              .catch((error) => {
                console.log("CORS error");
                $(this).find('[type="submit"]').toggleClass("loading");
              });
          } else {
            if (!/\w\w+/.test($(fullName).val())) {
              $(this).find(".form-error-block.full-name").text("Invalid full name");
              $(this).find(".form-error-block.full-name").show();
              var x = this;
              setTimeout(function () {
                $(x).find(".form-error-block.full-name").hide();
              }, 2000);
              $(this).find('[type="submit"]').toggleClass("loading");
            } else if (!isValidWebsite($(websiteLink).val())) {
              $(this).find(".form-error-block.website").text("Invalid website link");
              $(this).find(".form-error-block.website").show();
              var x = this;
              setTimeout(function () {
                $(x).find(".form-error-block.website").hide();
              }, 2000);
              $(this).find('[type="submit"]').toggleClass("loading");
            } else if (!validatePhoneNumber(phoneNumber, iti, phoneCode)) {
              $(this).find('[type="submit"]').toggleClass("loading");
            } else if (
              oneCheckboxIsFilled(whatsNeed1, whatsNeed2, formItem) === false &&
              !formItem.classList.contains("ebook-form")
            ) {
              $(this).find(".form-error-block.main-err").text("Please select atleast one checkbox");
              $(this).find(".form-error-block.main-err").show();
              var x = this;
              setTimeout(function () {
                $(x).find(".form-error-block.main-err").hide();
              }, 2000);
              $(this).find('[type="submit"]').toggleClass("loading");
            } else {
              console.log("error");
              //$(this).find(".form-error-block.main-err").text("Please fill all required fields.");
              //$(this).find(".form-error-block.main-err").show();
              //const formElement = this;
              // setTimeout(function () {
              //   $(formElement).find(".form-error-block.main-err").hide();
              // }, 2000);
              $(this).find('[type="submit"]').toggleClass("loading");
              // let widgetId = Number($(".g-recaptcha", formItem).data("widget-id"));
              //grecaptcha.reset(widgetId);
            }
          }
          formItem.classList.add("was-validated");
        },
        false
      );
    });
  }, false);
})();

//(data.company.risk_profile !== "blocked" || data.company.segment !== "unknown")
