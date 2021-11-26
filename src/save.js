for (let i = 0; i < this.numberDevelopper.length; i++) {
    this.data.filter((person) => person.Role === "Développeur")[i].modele = this.numberDevelopper[i]
  }
  for (let i = 0; i < this.num.length; i++) {
    this.data.filter((person) => person.Role === "Développeur")[i].modele = this.numberDevelopper[i]
  }

  setArrayNumber(role) {
    const arrayDevelopper = [];
    const arrayDesigner = [];

    if (role === "developper") {
      for (let i = 1; i <= 14; i++) {
        arrayDevelopper.push(i);
      }
      return arrayDevelopper.sort((a, b) => 0.5 - Math.random());
    } else {
      for (let i = 15; i <= 36; i++) {
        arrayDesigner.push(i);
      }
      return (this.arrayNumberDesigner = arrayDesigner.sort(
        (a, b) => 0.5 - Math.random()
      ));
    }
  }

  this.numberDevelopper = this.setArrayNumber("developper")
    this.numberDesigner = this.setArrayNumber("designer")