FROM python:3.6

ARG project_dir=/flask_back/

ADD requirements.txt $project_dir
COPY . $project_dir

WORKDIR $project_dir

RUN pip install -r requirements.txt

RUN export FLASK_APP='run.py'

CMD ["python", "run.py"]

