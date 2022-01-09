import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Icon } from 'semantic-ui-react';

import { apiBaseUrl } from '../constants';
import { useStateValue, setPatient } from '../state';
import { Patient } from '../types';

const PatientPage = () => {
	const [{ patient, diagnoses }, dispatch] = useStateValue();
	const { patientId } = useParams<{ patientId: string }>();
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	const getGenderIcon = (gender: string) => {
		if (gender === 'male') {
			return <Icon name="mars" />;
		} else if (gender === 'female') {
			return <Icon name="venus" />;
		} else {
			return <Icon name="genderless" />;
		}
	};

	React.useEffect(() => {
		const fetchPatient = async () => {
			if (patient === undefined || patient.id !== patientId) {
				try {
					const { data: patientFromApi } = await axios.get<Patient>(
						`${apiBaseUrl}/patients/${patientId}`
					);
					dispatch(setPatient(patientFromApi));
				} catch (e) {
					console.error(e);
				}
			}
			setIsLoading(false);
		};
		void fetchPatient();
	}, [patientId]);

	if (patient === undefined || isLoading) {
		return <div>loading...</div>;
	}

	return (
		<div className="App">
			<Container>
				<h3>
					{patient.name} {getGenderIcon(patient.gender)}
				</h3>
				<span>ssn:{patient.ssn}</span>
				<br></br>
				<span>occupation:{patient.occupation}</span>
				<h4>entries</h4>
				{patient.entries.map((entry) => (
					<div key={entry.id}>
						<p>{entry.description}</p>
						{entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
							<ul>
								{entry.diagnosisCodes.map((diagnosisCode) => {
									const diagnosis = diagnoses.find(
										(diagnosis) => diagnosis.code === diagnosisCode
									);
									const listText = diagnosis
										? `${diagnosisCode} ${diagnosis.name}`
										: diagnosisCode;
									return <li key={diagnosisCode}>{listText}</li>;
								})}
							</ul>
						)}
					</div>
				))}
			</Container>
		</div>
	);
};

export default PatientPage;
