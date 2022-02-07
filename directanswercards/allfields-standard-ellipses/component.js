{{> directanswercards/card_component componentName = 'allfields-standard-ellipses' }}

class allfields_standard_ellipsesComponent extends BaseDirectAnswerCard['allfields-standard-ellipses'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
  }

  /**
   * @param type the type of direct answer
   * @param answer the full answer returned from the API, corresponds to response.directAnswer.answer.
   * @param relatedItem profile of the related entity for the direct answer
   */
  dataForRender(type, answer, relatedItem) {
    let isArray = Array.isArray(answer.value);
    let value, arrayValue, regularValue, isRichText, copyValue;
    const linkTarget = AnswersExperience.runtimeConfig.get('linkTarget') || '_top';

    switch (answer.fieldType) {
      case 'url':
      case 'complex_url':
      case 'ios_app_url':
      case 'android_app_url':
      case 'facebook_url':
        if (isArray) {
          arrayValue = answer.value.map((value) => ({
              url: value,
              label: value
            }
          ));
          copyValue = arrayValue.map((value) => value.label).join("<br/>");
        } else {
          regularValue = {
            url: answer.value,
            label: answer.value
          };
          copyValue = regularValue.label;
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'email':
        if (isArray) {
          arrayValue = answer.value.map((value) => ({
              url: `mailto:${value}`,
              label: value,
            }
          ));
          copyValue = arrayValue.map((value) => value.label).join("<br/>");
        } else {
          regularValue = {
            url: `mailto:${answer.value}`,
            label: answer.value,
          };
          copyValue = regularValue.label;
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'instagram_handle':
        if (isArray) {
          arrayValue = answer.value.map((value) => ({
              url: `https://instagram.com/${value}`,
              label: `@${value}`,
            }
          ));
          copyValue = arrayValue.map((value) => value.label).join("<br/>");
        } else {
          regularValue = {
            url: `https://instagram.com/${answer.value}`,
            label: `@${answer.value}`,
          };
          copyValue = regularValue.label;
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'twitter_handle':
        if (isArray) {
          arrayValue = answer.value.map((value) => ({
              url: `https://twitter.com/${value}`,
              label: `@${value}`,
            }
          ));
          copyValue = arrayValue.map((value) => value.label).join("<br/>");
        } else {
          regularValue = {
            url: `https://twitter.com/${answer.value}`,
            label: `@${answer.value}`,
          };
          copyValue = regularValue.label;
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'phone':
        if (isArray) {
          arrayValue = answer.value.map((value) => ({
              url: Formatter.phoneLink({mainPhone: value}),
              label: Formatter.nationalizedPhoneDisplay({mainPhone: value}),
            }
          ));
          copyValue = arrayValue.map((value) => value.label).join("<br/>");
        } else {
          regularValue = {
            url: Formatter.phoneLink({mainPhone: answer.value}),
            label: Formatter.nationalizedPhoneDisplay({mainPhone: answer.value}),
          };
          copyValue = regularValue.label;
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'address':
        if (isArray) {
          arrayValue = answer.value.map((value) => Formatter.address({address: value}));
          copyValue = arrayValue.join("<br/>");
        } else {
          regularValue = Formatter.address({address: answer.value});
          copyValue = regularValue;
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'hours':
        const timezoneOffsetForLocation = relatedItem?.data?.fieldValues?.timeZoneUtcOffset;
        if (isArray) {
          arrayValue = answer.value.map((value) => {
            const openStatus = Formatter.openStatus({
              hours: value,
              timeZoneUtcOffset: timezoneOffsetForLocation
            });
            return `<div>${openStatus}</div>`;
          });
          copyValue = arrayValue.join("<br/>");
        } else {
          const openStatus = Formatter.openStatus({
            hours: answer.value,
            timeZoneUtcOffset: timezoneOffsetForLocation
          });
          regularValue = `<div>${openStatus}</div>`;
          copyValue = regularValue;
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'decimal':
        if (isArray) {
          arrayValue = answer.value.map((value) => value.toLocaleString());
          copyValue = arrayValue.join("<br/>");
        } else {
          regularValue = answer.value.toLocaleString();
          copyValue = regularValue;
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'rich_text':
        isRichText = true;
        if (isArray) {
          arrayValue = answer.value.map((value) => ANSWERS.formatRichText(value, null, linkTarget));
          copyValue = arrayValue.join("<br/>");
        } else {
          regularValue = ANSWERS.formatRichText(answer.value, null, linkTarget);
          copyValue = regularValue;
        }
        value = isArray ? arrayValue : regularValue;
        break;
      case 'single_line_text':
      case 'multi_line_text':
      default:
        value = answer.value;
        copyValue = isArray ? value.join("<br/>") : value;
        break;
    }

    // Optionally switch by field name
    // switch (answer.fieldApiName) {
    //   case 'mainPhone': // The Field API name
    //     if (isArray) {
    //       arrayValue = answer.value.map((value) => ({
    //           url: Formatter.phoneLink({mainPhone: value}),
    //           label: Formatter.nationalizedPhoneDisplay({mainPhone: value})
    //         }
    //       ));
    //     } else {
    //       regularValue = {
    //         url: Formatter.phoneLink({mainPhone: answer.value}),
    //         label: Formatter.nationalizedPhoneDisplay({mainPhone: answer.value})
    //       };
    //     }
    //     value = isArray ? arrayValue : regularValue;
    //     break;
    // }

    return {
      // iconName: '', // Icon that appears on the top left of the direct answer card
      // iconUrl: '', // URL for Icon that appears on the top left of the direct answer card
      entityName: answer.entityName, // Root of the breadcrumb in the card heading (entityName / fieldName)
      fieldName: answer.fieldName, // Folder of the breadcrumb (entityName / fieldName)
      value: value || answer.value,
      // link: '', // Link for the text of the direct answer
      // linkEventOptions: this.addDefaultEventOptions(), // The event options for link click analytics
      viewDetailsText: 'View Details', // Text below the direct answer
      viewDetailsLink: relatedItem.data.website, // Link for the “view details” text
      viewDetailsEventOptions: this.addDefaultEventOptions({
        ctaLabel: 'VIEW_DETAILS'
      }), // The event options for viewDetails click analytics
      linkTarget: linkTarget, // Target for all links in the direct answer
      // CTA: {
      //   label: '', // The CTA's label
      //   iconName: 'chevron', // The icon to use for the CTA
      //   url: '', // The URL a user will be directed to when clicking
      //   target: linkTarget, // Where the new URL will be opened
      //   eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
      //   eventOptions: this.addDefaultEventOptions() // The event options for CTA click analytics
      // },
      footerTextOnSubmission: 'Thank you for your feedback!', // Text to display in the footer when a thumbs up/down is clicked
      footerText: 'Was this the answer you were looking for?', // Text to display in the footer
      positiveFeedbackSrText: 'This answered my question', // Screen reader only text for thumbs-up
      negativeFeedbackSrText: 'This did not answer my question', // Screen reader only text for thumbs-down
      isRichText: isRichText, // If the direct answer is sourced from a rich-text field
      menuCopyUrl: value.url,
      menuCopyText: "`" + copyValue + "`",
    };
  }

  /**
   * The template to render
   * @returns {string}
   * @override
   */
  static defaultTemplateName (config) {
    return 'directanswercards/allfields-standard-ellipses';
  }
}

ANSWERS.registerTemplate(
  'directanswercards/allfields-standard-ellipses',
  {{{stringifyPartial (read 'directanswercards/allfields-standard-ellipses/template') }}}
);
ANSWERS.registerComponentType(allfields_standard_ellipsesComponent);
