import React from "react";
import { translate } from "react-i18next";
import RoundedBox from "../../components/RoundedBox";
import MetricScore from "../../components/MetricScore";
import GreyText from "../../components/GreyText";
import { displayedDate } from "../../utilities";

const TEST_FOR_DISEASE = {
  asthma : {
    title: "ASTHMA_CONTROL_TEST",
    textValue : (score, type) => {
      const ranges = {
        child: [
          {
            value: 12,
            text: "VERY_POORLY_CONTROLLED"
          },
          {
            value: 19,
            text: "NOT_WELL_CONTROLLED"
          },
          {
            value: 27,
            text: "WELL_CONTROLLED"
          }
        ],
        adult: [
          {
            value: 15,
            text: "VERY_POORLY_CONTROLLED"
          },
          {
            value: 19,
            text: "NOT_WELL_CONTROLLED"
          },
          {
            value: 25,
            text: "WELL_CONTROLLED"
          }
        ]
      };

      return ranges[type].filter(r => score <= r.value)[0].text;
    }
  },
  copd   : {
    title: "COPD_ASSESSMENT_TEST",
    textValue : score => {
      const ranges = [
        {
          value : 9,
          text  : "LOW_IMPACT"
        },
        {
          value : 20,
          text  : "MEDIUM_IMPACT"
        },
        {
          value : 30,
          text  : "HIGH_IMPACT"
        },
        {
          value : 40,
          text  : "VERY_HIGH_IMPACT"
        }
      ];

      return ranges.filter(r => score <= r.value)[0].text;
    }
  }
};

const QuizScore = ({ quiz, disease, t }) => {
  const testConfig = TEST_FOR_DISEASE[disease];

  return (
    <RoundedBox>
      <h4>{t(testConfig.title)}</h4>
      <MetricScore>
        {quiz.score
          ? `${quiz.score} | ${t(testConfig.textValue(quiz.score, quiz.type))}`
          : t("N_A")
        }
      </MetricScore>
      <br />
      <GreyText>
        {quiz.date
          ? t("TAKEN_ON_DATE", { date: displayedDate(quiz.date, "LL") })
          : t("NOT_TAKEN")
        }
      </GreyText>
    </RoundedBox>
  );
};

export default translate("patient-report")(QuizScore);
