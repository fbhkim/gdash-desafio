FROM python:3.11-alpine
WORKDIR /app
RUN pip install requests pika
COPY main.py ./
CMD ["python","main.py"]
